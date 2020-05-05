/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactoryResolver, NgZone } from '@angular/core';
import { $COMPILE, $INJECTOR, $PARSE, INJECTOR_KEY, LAZY_MODULE_REF, REQUIRE_INJECTOR, REQUIRE_NG_MODEL } from './constants';
import { DowngradeComponentAdapter } from './downgrade_component_adapter';
import { SyncPromise } from './promise_util';
import { controllerKey, getDowngradedModuleCount, getTypeName, getUpgradeAppType, validateInjectionKey } from './util';
/**
 * @description
 *
 * A helper function that allows an Angular component to be used from AngularJS.
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AOT compilation*
 *
 * This helper function returns a factory function to be used for registering
 * an AngularJS wrapper directive for "downgrading" an Angular component.
 *
 * @usageNotes
 * ### Examples
 *
 * Let's assume that you have an Angular component called `ng2Heroes` that needs
 * to be made available in AngularJS templates.
 *
 * {@example upgrade/static/ts/full/module.ts region="ng2-heroes"}
 *
 * We must create an AngularJS [directive](https://docs.angularjs.org/guide/directive)
 * that will make this Angular component available inside AngularJS templates.
 * The `downgradeComponent()` function returns a factory function that we
 * can use to define the AngularJS directive that wraps the "downgraded" component.
 *
 * {@example upgrade/static/ts/full/module.ts region="ng2-heroes-wrapper"}
 *
 * For more details and examples on downgrading Angular components to AngularJS components please
 * visit the [Upgrade guide](guide/upgrade#using-angular-components-from-angularjs-code).
 *
 * @param info contains information about the Component that is being downgraded:
 *
 * - `component: Type<any>`: The type of the Component that will be downgraded
 * - `downgradedModule?: string`: The name of the downgraded module (if any) that the component
 *   "belongs to", as returned by a call to `downgradeModule()`. It is the module, whose
 *   corresponding Angular module will be bootstrapped, when the component needs to be instantiated.
 *   <br />
 *   (This option is only necessary when using `downgradeModule()` to downgrade more than one
 *   Angular module.)
 * - `propagateDigest?: boolean`: Whether to perform {@link ChangeDetectorRef#detectChanges
 *   change detection} on the component on every
 *   [$digest](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest). If set to `false`,
 *   change detection will still be performed when any of the component's inputs changes.
 *   (Default: true)
 *
 * @returns a factory function that can be used to register the component in an
 * AngularJS module.
 *
 * @publicApi
 */
export function downgradeComponent(info) {
    const directiveFactory = function ($compile, $injector, $parse) {
        // When using `downgradeModule()`, we need to handle certain things specially. For example:
        // - We always need to attach the component view to the `ApplicationRef` for it to be
        //   dirty-checked.
        // - We need to ensure callbacks to Angular APIs (e.g. change detection) are run inside the
        //   Angular zone.
        //   NOTE: This is not needed, when using `UpgradeModule`, because `$digest()` will be run
        //         inside the Angular zone (except if explicitly escaped, in which case we shouldn't
        //         force it back in).
        const isNgUpgradeLite = getUpgradeAppType($injector) === 3 /* Lite */;
        const wrapCallback = !isNgUpgradeLite ? cb => cb : cb => () => NgZone.isInAngularZone() ? cb() : ngZone.run(cb);
        let ngZone;
        // When downgrading multiple modules, special handling is needed wrt injectors.
        const hasMultipleDowngradedModules = isNgUpgradeLite && (getDowngradedModuleCount($injector) > 1);
        return {
            restrict: 'E',
            terminal: true,
            require: [REQUIRE_INJECTOR, REQUIRE_NG_MODEL],
            link: (scope, element, attrs, required) => {
                // We might have to compile the contents asynchronously, because this might have been
                // triggered by `UpgradeNg1ComponentAdapterBuilder`, before the Angular templates have
                // been compiled.
                const ngModel = required[1];
                const parentInjector = required[0];
                let moduleInjector = undefined;
                let ranAsync = false;
                if (!parentInjector || hasMultipleDowngradedModules) {
                    const downgradedModule = info.downgradedModule || '';
                    const lazyModuleRefKey = `${LAZY_MODULE_REF}${downgradedModule}`;
                    const attemptedAction = `instantiating component '${getTypeName(info.component)}'`;
                    validateInjectionKey($injector, downgradedModule, lazyModuleRefKey, attemptedAction);
                    const lazyModuleRef = $injector.get(lazyModuleRefKey);
                    moduleInjector = lazyModuleRef.injector || lazyModuleRef.promise;
                }
                // Notes:
                //
                // There are two injectors: `finalModuleInjector` and `finalParentInjector` (they might be
                // the same instance, but that is irrelevant):
                // - `finalModuleInjector` is used to retrieve `ComponentFactoryResolver`, thus it must be
                //   on the same tree as the `NgModule` that declares this downgraded component.
                // - `finalParentInjector` is used for all other injection purposes.
                //   (Note that Angular knows to only traverse the component-tree part of that injector,
                //   when looking for an injectable and then switch to the module injector.)
                //
                // There are basically three cases:
                // - If there is no parent component (thus no `parentInjector`), we bootstrap the downgraded
                //   `NgModule` and use its injector as both `finalModuleInjector` and
                //   `finalParentInjector`.
                // - If there is a parent component (and thus a `parentInjector`) and we are sure that it
                //   belongs to the same `NgModule` as this downgraded component (e.g. because there is only
                //   one downgraded module, we use that `parentInjector` as both `finalModuleInjector` and
                //   `finalParentInjector`.
                // - If there is a parent component, but it may belong to a different `NgModule`, then we
                //   use the `parentInjector` as `finalParentInjector` and this downgraded component's
                //   declaring `NgModule`'s injector as `finalModuleInjector`.
                //   Note 1: If the `NgModule` is already bootstrapped, we just get its injector (we don't
                //           bootstrap again).
                //   Note 2: It is possible that (while there are multiple downgraded modules) this
                //           downgraded component and its parent component both belong to the same NgModule.
                //           In that case, we could have used the `parentInjector` as both
                //           `finalModuleInjector` and `finalParentInjector`, but (for simplicity) we are
                //           treating this case as if they belong to different `NgModule`s. That doesn't
                //           really affect anything, since `parentInjector` has `moduleInjector` as ancestor
                //           and trying to resolve `ComponentFactoryResolver` from either one will return
                //           the same instance.
                // If there is a parent component, use its injector as parent injector.
                // If this is a "top-level" Angular component, use the module injector.
                const finalParentInjector = parentInjector || moduleInjector;
                // If this is a "top-level" Angular component or the parent component may belong to a
                // different `NgModule`, use the module injector for module-specific dependencies.
                // If there is a parent component that belongs to the same `NgModule`, use its injector.
                const finalModuleInjector = moduleInjector || parentInjector;
                const doDowngrade = (injector, moduleInjector) => {
                    // Retrieve `ComponentFactoryResolver` from the injector tied to the `NgModule` this
                    // component belongs to.
                    const componentFactoryResolver = moduleInjector.get(ComponentFactoryResolver);
                    const componentFactory = componentFactoryResolver.resolveComponentFactory(info.component);
                    if (!componentFactory) {
                        throw new Error(`Expecting ComponentFactory for: ${getTypeName(info.component)}`);
                    }
                    const injectorPromise = new ParentInjectorPromise(element);
                    const facade = new DowngradeComponentAdapter(element, attrs, scope, ngModel, injector, $injector, $compile, $parse, componentFactory, wrapCallback);
                    const projectableNodes = facade.compileContents();
                    facade.createComponent(projectableNodes);
                    facade.setupInputs(isNgUpgradeLite, info.propagateDigest);
                    facade.setupOutputs();
                    facade.registerCleanup();
                    injectorPromise.resolve(facade.getInjector());
                    if (ranAsync) {
                        // If this is run async, it is possible that it is not run inside a
                        // digest and initial input values will not be detected.
                        scope.$evalAsync(() => { });
                    }
                };
                const downgradeFn = !isNgUpgradeLite ? doDowngrade : (pInjector, mInjector) => {
                    if (!ngZone) {
                        ngZone = pInjector.get(NgZone);
                    }
                    wrapCallback(() => doDowngrade(pInjector, mInjector))();
                };
                // NOTE:
                // Not using `ParentInjectorPromise.all()` (which is inherited from `SyncPromise`), because
                // Closure Compiler (or some related tool) complains:
                // `TypeError: ...$src$downgrade_component_ParentInjectorPromise.all is not a function`
                SyncPromise.all([finalParentInjector, finalModuleInjector])
                    .then(([pInjector, mInjector]) => downgradeFn(pInjector, mInjector));
                ranAsync = true;
            }
        };
    };
    // bracket-notation because of closure - see #14441
    directiveFactory['$inject'] = [$COMPILE, $INJECTOR, $PARSE];
    return directiveFactory;
}
/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of AngularJS's `$compile`.
 */
class ParentInjectorPromise extends SyncPromise {
    constructor(element) {
        super();
        this.element = element;
        this.injectorKey = controllerKey(INJECTOR_KEY);
        // Store the promise on the element.
        element.data(this.injectorKey, this);
    }
    resolve(injector) {
        // Store the real injector on the element.
        this.element.data(this.injectorKey, injector);
        // Release the element to prevent memory leaks.
        this.element = null;
        // Resolve the promise.
        super.resolve(injector);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2NvbW1vbi9zcmMvZG93bmdyYWRlX2NvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQW1CLHdCQUF3QixFQUFZLE1BQU0sRUFBTyxNQUFNLGVBQWUsQ0FBQztBQUdqRyxPQUFPLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMzSCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsV0FBVyxFQUFXLE1BQU0sZ0JBQWdCLENBQUM7QUFDckQsT0FBTyxFQUFDLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQWlDLG9CQUFvQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR3BKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnREc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsSUFVbEM7SUFDQyxNQUFNLGdCQUFnQixHQUF1QixVQUN6QyxRQUF5QixFQUFFLFNBQTJCLEVBQUUsTUFBcUI7UUFDL0UsMkZBQTJGO1FBQzNGLHFGQUFxRjtRQUNyRixtQkFBbUI7UUFDbkIsMkZBQTJGO1FBQzNGLGtCQUFrQjtRQUNsQiwwRkFBMEY7UUFDMUYsNEZBQTRGO1FBQzVGLDZCQUE2QjtRQUM3QixNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsaUJBQXdCLENBQUM7UUFDN0UsTUFBTSxZQUFZLEdBQ2QsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0YsSUFBSSxNQUFjLENBQUM7UUFFbkIsK0VBQStFO1FBQy9FLE1BQU0sNEJBQTRCLEdBQzlCLGVBQWUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWpFLE9BQU87WUFDTCxRQUFRLEVBQUUsR0FBRztZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7WUFDN0MsSUFBSSxFQUFFLENBQUMsS0FBYSxFQUFFLE9BQXlCLEVBQUUsS0FBa0IsRUFBRSxRQUFlLEVBQUUsRUFBRTtnQkFDdEYscUZBQXFGO2dCQUNyRixzRkFBc0Y7Z0JBQ3RGLGlCQUFpQjtnQkFFakIsTUFBTSxPQUFPLEdBQXVCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxjQUFjLEdBQTBDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUUsSUFBSSxjQUFjLEdBQTBDLFNBQVMsQ0FBQztnQkFDdEUsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUVyQixJQUFJLENBQUMsY0FBYyxJQUFJLDRCQUE0QixFQUFFO29CQUNuRCxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7b0JBQ3JELE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxlQUFlLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDakUsTUFBTSxlQUFlLEdBQUcsNEJBQTRCLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztvQkFFbkYsb0JBQW9CLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFDO29CQUVyRixNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFrQixDQUFDO29CQUN2RSxjQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsSUFBSSxhQUFhLENBQUMsT0FBNEIsQ0FBQztpQkFDdkY7Z0JBRUQsU0FBUztnQkFDVCxFQUFFO2dCQUNGLDBGQUEwRjtnQkFDMUYsOENBQThDO2dCQUM5QywwRkFBMEY7Z0JBQzFGLGdGQUFnRjtnQkFDaEYsb0VBQW9FO2dCQUNwRSx3RkFBd0Y7Z0JBQ3hGLDRFQUE0RTtnQkFDNUUsRUFBRTtnQkFDRixtQ0FBbUM7Z0JBQ25DLDRGQUE0RjtnQkFDNUYsc0VBQXNFO2dCQUN0RSwyQkFBMkI7Z0JBQzNCLHlGQUF5RjtnQkFDekYsNEZBQTRGO2dCQUM1RiwwRkFBMEY7Z0JBQzFGLDJCQUEyQjtnQkFDM0IseUZBQXlGO2dCQUN6RixzRkFBc0Y7Z0JBQ3RGLDhEQUE4RDtnQkFDOUQsMEZBQTBGO2dCQUMxRiw4QkFBOEI7Z0JBQzlCLG1GQUFtRjtnQkFDbkYsNEZBQTRGO2dCQUM1RiwwRUFBMEU7Z0JBQzFFLHlGQUF5RjtnQkFDekYsd0ZBQXdGO2dCQUN4Riw0RkFBNEY7Z0JBQzVGLHlGQUF5RjtnQkFDekYsK0JBQStCO2dCQUUvQix1RUFBdUU7Z0JBQ3ZFLHVFQUF1RTtnQkFDdkUsTUFBTSxtQkFBbUIsR0FBRyxjQUFjLElBQUksY0FBZSxDQUFDO2dCQUU5RCxxRkFBcUY7Z0JBQ3JGLGtGQUFrRjtnQkFDbEYsd0ZBQXdGO2dCQUN4RixNQUFNLG1CQUFtQixHQUFHLGNBQWMsSUFBSSxjQUFlLENBQUM7Z0JBRTlELE1BQU0sV0FBVyxHQUFHLENBQUMsUUFBa0IsRUFBRSxjQUF3QixFQUFFLEVBQUU7b0JBQ25FLG9GQUFvRjtvQkFDcEYsd0JBQXdCO29CQUN4QixNQUFNLHdCQUF3QixHQUMxQixjQUFjLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBQ2pELE1BQU0sZ0JBQWdCLEdBQ2xCLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztvQkFFdEUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO3dCQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDbkY7b0JBRUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDM0QsTUFBTSxNQUFNLEdBQUcsSUFBSSx5QkFBeUIsQ0FDeEMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFDckUsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBRXBDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUNsRCxNQUFNLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ3pDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUN0QixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBRXpCLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7b0JBRTlDLElBQUksUUFBUSxFQUFFO3dCQUNaLG1FQUFtRTt3QkFDbkUsd0RBQXdEO3dCQUN4RCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM1QjtnQkFDSCxDQUFDLENBQUM7Z0JBRUYsTUFBTSxXQUFXLEdBQ2IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFtQixFQUFFLFNBQW1CLEVBQUUsRUFBRTtvQkFDNUUsSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDWCxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDaEM7b0JBRUQsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMxRCxDQUFDLENBQUM7Z0JBRU4sUUFBUTtnQkFDUiwyRkFBMkY7Z0JBQzNGLHFEQUFxRDtnQkFDckQsdUZBQXVGO2dCQUN2RixXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztxQkFDdEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFFekUsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNsQixDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVGLG1EQUFtRDtJQUNuRCxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUQsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxxQkFBc0IsU0FBUSxXQUFxQjtJQUd2RCxZQUFvQixPQUF5QjtRQUMzQyxLQUFLLEVBQUUsQ0FBQztRQURVLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBRnJDLGdCQUFXLEdBQVcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBS3hELG9DQUFvQztRQUNwQyxPQUFPLENBQUMsSUFBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFrQjtRQUN4QiwwQ0FBMEM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvQywrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFLLENBQUM7UUFFckIsdUJBQXVCO1FBQ3ZCLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEZhY3RvcnksIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgSW5qZWN0b3IsIE5nWm9uZSwgVHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SUFubm90YXRlZEZ1bmN0aW9uLCBJQXR0cmlidXRlcywgSUF1Z21lbnRlZEpRdWVyeSwgSUNvbXBpbGVTZXJ2aWNlLCBJRGlyZWN0aXZlLCBJSW5qZWN0b3JTZXJ2aWNlLCBJTmdNb2RlbENvbnRyb2xsZXIsIElQYXJzZVNlcnZpY2UsIElTY29wZX0gZnJvbSAnLi9hbmd1bGFyMSc7XG5pbXBvcnQgeyRDT01QSUxFLCAkSU5KRUNUT1IsICRQQVJTRSwgSU5KRUNUT1JfS0VZLCBMQVpZX01PRFVMRV9SRUYsIFJFUVVJUkVfSU5KRUNUT1IsIFJFUVVJUkVfTkdfTU9ERUx9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7RG93bmdyYWRlQ29tcG9uZW50QWRhcHRlcn0gZnJvbSAnLi9kb3duZ3JhZGVfY29tcG9uZW50X2FkYXB0ZXInO1xuaW1wb3J0IHtTeW5jUHJvbWlzZSwgVGhlbmFibGV9IGZyb20gJy4vcHJvbWlzZV91dGlsJztcbmltcG9ydCB7Y29udHJvbGxlcktleSwgZ2V0RG93bmdyYWRlZE1vZHVsZUNvdW50LCBnZXRUeXBlTmFtZSwgZ2V0VXBncmFkZUFwcFR5cGUsIExhenlNb2R1bGVSZWYsIFVwZ3JhZGVBcHBUeXBlLCB2YWxpZGF0ZUluamVjdGlvbktleX0gZnJvbSAnLi91dGlsJztcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEEgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYWxsb3dzIGFuIEFuZ3VsYXIgY29tcG9uZW50IHRvIGJlIHVzZWQgZnJvbSBBbmd1bGFySlMuXG4gKlxuICogKlBhcnQgb2YgdGhlIFt1cGdyYWRlL3N0YXRpY10oYXBpP3F1ZXJ5PXVwZ3JhZGUlMkZzdGF0aWMpXG4gKiBsaWJyYXJ5IGZvciBoeWJyaWQgdXBncmFkZSBhcHBzIHRoYXQgc3VwcG9ydCBBT1QgY29tcGlsYXRpb24qXG4gKlxuICogVGhpcyBoZWxwZXIgZnVuY3Rpb24gcmV0dXJucyBhIGZhY3RvcnkgZnVuY3Rpb24gdG8gYmUgdXNlZCBmb3IgcmVnaXN0ZXJpbmdcbiAqIGFuIEFuZ3VsYXJKUyB3cmFwcGVyIGRpcmVjdGl2ZSBmb3IgXCJkb3duZ3JhZGluZ1wiIGFuIEFuZ3VsYXIgY29tcG9uZW50LlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiAjIyMgRXhhbXBsZXNcbiAqXG4gKiBMZXQncyBhc3N1bWUgdGhhdCB5b3UgaGF2ZSBhbiBBbmd1bGFyIGNvbXBvbmVudCBjYWxsZWQgYG5nMkhlcm9lc2AgdGhhdCBuZWVkc1xuICogdG8gYmUgbWFkZSBhdmFpbGFibGUgaW4gQW5ndWxhckpTIHRlbXBsYXRlcy5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwibmcyLWhlcm9lc1wifVxuICpcbiAqIFdlIG11c3QgY3JlYXRlIGFuIEFuZ3VsYXJKUyBbZGlyZWN0aXZlXShodHRwczovL2RvY3MuYW5ndWxhcmpzLm9yZy9ndWlkZS9kaXJlY3RpdmUpXG4gKiB0aGF0IHdpbGwgbWFrZSB0aGlzIEFuZ3VsYXIgY29tcG9uZW50IGF2YWlsYWJsZSBpbnNpZGUgQW5ndWxhckpTIHRlbXBsYXRlcy5cbiAqIFRoZSBgZG93bmdyYWRlQ29tcG9uZW50KClgIGZ1bmN0aW9uIHJldHVybnMgYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgd2VcbiAqIGNhbiB1c2UgdG8gZGVmaW5lIHRoZSBBbmd1bGFySlMgZGlyZWN0aXZlIHRoYXQgd3JhcHMgdGhlIFwiZG93bmdyYWRlZFwiIGNvbXBvbmVudC5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwibmcyLWhlcm9lcy13cmFwcGVyXCJ9XG4gKlxuICogRm9yIG1vcmUgZGV0YWlscyBhbmQgZXhhbXBsZXMgb24gZG93bmdyYWRpbmcgQW5ndWxhciBjb21wb25lbnRzIHRvIEFuZ3VsYXJKUyBjb21wb25lbnRzIHBsZWFzZVxuICogdmlzaXQgdGhlIFtVcGdyYWRlIGd1aWRlXShndWlkZS91cGdyYWRlI3VzaW5nLWFuZ3VsYXItY29tcG9uZW50cy1mcm9tLWFuZ3VsYXJqcy1jb2RlKS5cbiAqXG4gKiBAcGFyYW0gaW5mbyBjb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgQ29tcG9uZW50IHRoYXQgaXMgYmVpbmcgZG93bmdyYWRlZDpcbiAqXG4gKiAtIGBjb21wb25lbnQ6IFR5cGU8YW55PmA6IFRoZSB0eXBlIG9mIHRoZSBDb21wb25lbnQgdGhhdCB3aWxsIGJlIGRvd25ncmFkZWRcbiAqIC0gYGRvd25ncmFkZWRNb2R1bGU/OiBzdHJpbmdgOiBUaGUgbmFtZSBvZiB0aGUgZG93bmdyYWRlZCBtb2R1bGUgKGlmIGFueSkgdGhhdCB0aGUgY29tcG9uZW50XG4gKiAgIFwiYmVsb25ncyB0b1wiLCBhcyByZXR1cm5lZCBieSBhIGNhbGwgdG8gYGRvd25ncmFkZU1vZHVsZSgpYC4gSXQgaXMgdGhlIG1vZHVsZSwgd2hvc2VcbiAqICAgY29ycmVzcG9uZGluZyBBbmd1bGFyIG1vZHVsZSB3aWxsIGJlIGJvb3RzdHJhcHBlZCwgd2hlbiB0aGUgY29tcG9uZW50IG5lZWRzIHRvIGJlIGluc3RhbnRpYXRlZC5cbiAqICAgPGJyIC8+XG4gKiAgIChUaGlzIG9wdGlvbiBpcyBvbmx5IG5lY2Vzc2FyeSB3aGVuIHVzaW5nIGBkb3duZ3JhZGVNb2R1bGUoKWAgdG8gZG93bmdyYWRlIG1vcmUgdGhhbiBvbmVcbiAqICAgQW5ndWxhciBtb2R1bGUuKVxuICogLSBgcHJvcGFnYXRlRGlnZXN0PzogYm9vbGVhbmA6IFdoZXRoZXIgdG8gcGVyZm9ybSB7QGxpbmsgQ2hhbmdlRGV0ZWN0b3JSZWYjZGV0ZWN0Q2hhbmdlc1xuICogICBjaGFuZ2UgZGV0ZWN0aW9ufSBvbiB0aGUgY29tcG9uZW50IG9uIGV2ZXJ5XG4gKiAgIFskZGlnZXN0XShodHRwczovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcvdHlwZS8kcm9vdFNjb3BlLlNjb3BlIyRkaWdlc3QpLiBJZiBzZXQgdG8gYGZhbHNlYCxcbiAqICAgY2hhbmdlIGRldGVjdGlvbiB3aWxsIHN0aWxsIGJlIHBlcmZvcm1lZCB3aGVuIGFueSBvZiB0aGUgY29tcG9uZW50J3MgaW5wdXRzIGNoYW5nZXMuXG4gKiAgIChEZWZhdWx0OiB0cnVlKVxuICpcbiAqIEByZXR1cm5zIGEgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIHRoZSBjb21wb25lbnQgaW4gYW5cbiAqIEFuZ3VsYXJKUyBtb2R1bGUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZG93bmdyYWRlQ29tcG9uZW50KGluZm86IHtcbiAgY29tcG9uZW50OiBUeXBlPGFueT47XG4gIGRvd25ncmFkZWRNb2R1bGU/OiBzdHJpbmc7XG4gIHByb3BhZ2F0ZURpZ2VzdD86IGJvb2xlYW47XG4gIC8qKiBAZGVwcmVjYXRlZCBzaW5jZSB2NC4gVGhpcyBwYXJhbWV0ZXIgaXMgbm8gbG9uZ2VyIHVzZWQgKi9cbiAgaW5wdXRzPzogc3RyaW5nW107XG4gIC8qKiBAZGVwcmVjYXRlZCBzaW5jZSB2NC4gVGhpcyBwYXJhbWV0ZXIgaXMgbm8gbG9uZ2VyIHVzZWQgKi9cbiAgb3V0cHV0cz86IHN0cmluZ1tdO1xuICAvKiogQGRlcHJlY2F0ZWQgc2luY2UgdjQuIFRoaXMgcGFyYW1ldGVyIGlzIG5vIGxvbmdlciB1c2VkICovXG4gIHNlbGVjdG9ycz86IHN0cmluZ1tdO1xufSk6IGFueSAvKiBhbmd1bGFyLklJbmplY3RhYmxlICovIHtcbiAgY29uc3QgZGlyZWN0aXZlRmFjdG9yeTogSUFubm90YXRlZEZ1bmN0aW9uID0gZnVuY3Rpb24oXG4gICAgICAkY29tcGlsZTogSUNvbXBpbGVTZXJ2aWNlLCAkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UsICRwYXJzZTogSVBhcnNlU2VydmljZSk6IElEaXJlY3RpdmUge1xuICAgIC8vIFdoZW4gdXNpbmcgYGRvd25ncmFkZU1vZHVsZSgpYCwgd2UgbmVlZCB0byBoYW5kbGUgY2VydGFpbiB0aGluZ3Mgc3BlY2lhbGx5LiBGb3IgZXhhbXBsZTpcbiAgICAvLyAtIFdlIGFsd2F5cyBuZWVkIHRvIGF0dGFjaCB0aGUgY29tcG9uZW50IHZpZXcgdG8gdGhlIGBBcHBsaWNhdGlvblJlZmAgZm9yIGl0IHRvIGJlXG4gICAgLy8gICBkaXJ0eS1jaGVja2VkLlxuICAgIC8vIC0gV2UgbmVlZCB0byBlbnN1cmUgY2FsbGJhY2tzIHRvIEFuZ3VsYXIgQVBJcyAoZS5nLiBjaGFuZ2UgZGV0ZWN0aW9uKSBhcmUgcnVuIGluc2lkZSB0aGVcbiAgICAvLyAgIEFuZ3VsYXIgem9uZS5cbiAgICAvLyAgIE5PVEU6IFRoaXMgaXMgbm90IG5lZWRlZCwgd2hlbiB1c2luZyBgVXBncmFkZU1vZHVsZWAsIGJlY2F1c2UgYCRkaWdlc3QoKWAgd2lsbCBiZSBydW5cbiAgICAvLyAgICAgICAgIGluc2lkZSB0aGUgQW5ndWxhciB6b25lIChleGNlcHQgaWYgZXhwbGljaXRseSBlc2NhcGVkLCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZG4ndFxuICAgIC8vICAgICAgICAgZm9yY2UgaXQgYmFjayBpbikuXG4gICAgY29uc3QgaXNOZ1VwZ3JhZGVMaXRlID0gZ2V0VXBncmFkZUFwcFR5cGUoJGluamVjdG9yKSA9PT0gVXBncmFkZUFwcFR5cGUuTGl0ZTtcbiAgICBjb25zdCB3cmFwQ2FsbGJhY2s6IDxUPihjYjogKCkgPT4gVCkgPT4gdHlwZW9mIGNiID1cbiAgICAgICAgIWlzTmdVcGdyYWRlTGl0ZSA/IGNiID0+IGNiIDogY2IgPT4gKCkgPT4gTmdab25lLmlzSW5Bbmd1bGFyWm9uZSgpID8gY2IoKSA6IG5nWm9uZS5ydW4oY2IpO1xuICAgIGxldCBuZ1pvbmU6IE5nWm9uZTtcblxuICAgIC8vIFdoZW4gZG93bmdyYWRpbmcgbXVsdGlwbGUgbW9kdWxlcywgc3BlY2lhbCBoYW5kbGluZyBpcyBuZWVkZWQgd3J0IGluamVjdG9ycy5cbiAgICBjb25zdCBoYXNNdWx0aXBsZURvd25ncmFkZWRNb2R1bGVzID1cbiAgICAgICAgaXNOZ1VwZ3JhZGVMaXRlICYmIChnZXREb3duZ3JhZGVkTW9kdWxlQ291bnQoJGluamVjdG9yKSA+IDEpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgIHJlcXVpcmU6IFtSRVFVSVJFX0lOSkVDVE9SLCBSRVFVSVJFX05HX01PREVMXSxcbiAgICAgIGxpbms6IChzY29wZTogSVNjb3BlLCBlbGVtZW50OiBJQXVnbWVudGVkSlF1ZXJ5LCBhdHRyczogSUF0dHJpYnV0ZXMsIHJlcXVpcmVkOiBhbnlbXSkgPT4ge1xuICAgICAgICAvLyBXZSBtaWdodCBoYXZlIHRvIGNvbXBpbGUgdGhlIGNvbnRlbnRzIGFzeW5jaHJvbm91c2x5LCBiZWNhdXNlIHRoaXMgbWlnaHQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIHRyaWdnZXJlZCBieSBgVXBncmFkZU5nMUNvbXBvbmVudEFkYXB0ZXJCdWlsZGVyYCwgYmVmb3JlIHRoZSBBbmd1bGFyIHRlbXBsYXRlcyBoYXZlXG4gICAgICAgIC8vIGJlZW4gY29tcGlsZWQuXG5cbiAgICAgICAgY29uc3QgbmdNb2RlbDogSU5nTW9kZWxDb250cm9sbGVyID0gcmVxdWlyZWRbMV07XG4gICAgICAgIGNvbnN0IHBhcmVudEluamVjdG9yOiBJbmplY3RvcnxUaGVuYWJsZTxJbmplY3Rvcj58dW5kZWZpbmVkID0gcmVxdWlyZWRbMF07XG4gICAgICAgIGxldCBtb2R1bGVJbmplY3RvcjogSW5qZWN0b3J8VGhlbmFibGU8SW5qZWN0b3I+fHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHJhbkFzeW5jID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCFwYXJlbnRJbmplY3RvciB8fCBoYXNNdWx0aXBsZURvd25ncmFkZWRNb2R1bGVzKSB7XG4gICAgICAgICAgY29uc3QgZG93bmdyYWRlZE1vZHVsZSA9IGluZm8uZG93bmdyYWRlZE1vZHVsZSB8fCAnJztcbiAgICAgICAgICBjb25zdCBsYXp5TW9kdWxlUmVmS2V5ID0gYCR7TEFaWV9NT0RVTEVfUkVGfSR7ZG93bmdyYWRlZE1vZHVsZX1gO1xuICAgICAgICAgIGNvbnN0IGF0dGVtcHRlZEFjdGlvbiA9IGBpbnN0YW50aWF0aW5nIGNvbXBvbmVudCAnJHtnZXRUeXBlTmFtZShpbmZvLmNvbXBvbmVudCl9J2A7XG5cbiAgICAgICAgICB2YWxpZGF0ZUluamVjdGlvbktleSgkaW5qZWN0b3IsIGRvd25ncmFkZWRNb2R1bGUsIGxhenlNb2R1bGVSZWZLZXksIGF0dGVtcHRlZEFjdGlvbik7XG5cbiAgICAgICAgICBjb25zdCBsYXp5TW9kdWxlUmVmID0gJGluamVjdG9yLmdldChsYXp5TW9kdWxlUmVmS2V5KSBhcyBMYXp5TW9kdWxlUmVmO1xuICAgICAgICAgIG1vZHVsZUluamVjdG9yID0gbGF6eU1vZHVsZVJlZi5pbmplY3RvciB8fCBsYXp5TW9kdWxlUmVmLnByb21pc2UgYXMgUHJvbWlzZTxJbmplY3Rvcj47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RlczpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlcmUgYXJlIHR3byBpbmplY3RvcnM6IGBmaW5hbE1vZHVsZUluamVjdG9yYCBhbmQgYGZpbmFsUGFyZW50SW5qZWN0b3JgICh0aGV5IG1pZ2h0IGJlXG4gICAgICAgIC8vIHRoZSBzYW1lIGluc3RhbmNlLCBidXQgdGhhdCBpcyBpcnJlbGV2YW50KTpcbiAgICAgICAgLy8gLSBgZmluYWxNb2R1bGVJbmplY3RvcmAgaXMgdXNlZCB0byByZXRyaWV2ZSBgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyYCwgdGh1cyBpdCBtdXN0IGJlXG4gICAgICAgIC8vICAgb24gdGhlIHNhbWUgdHJlZSBhcyB0aGUgYE5nTW9kdWxlYCB0aGF0IGRlY2xhcmVzIHRoaXMgZG93bmdyYWRlZCBjb21wb25lbnQuXG4gICAgICAgIC8vIC0gYGZpbmFsUGFyZW50SW5qZWN0b3JgIGlzIHVzZWQgZm9yIGFsbCBvdGhlciBpbmplY3Rpb24gcHVycG9zZXMuXG4gICAgICAgIC8vICAgKE5vdGUgdGhhdCBBbmd1bGFyIGtub3dzIHRvIG9ubHkgdHJhdmVyc2UgdGhlIGNvbXBvbmVudC10cmVlIHBhcnQgb2YgdGhhdCBpbmplY3RvcixcbiAgICAgICAgLy8gICB3aGVuIGxvb2tpbmcgZm9yIGFuIGluamVjdGFibGUgYW5kIHRoZW4gc3dpdGNoIHRvIHRoZSBtb2R1bGUgaW5qZWN0b3IuKVxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGVyZSBhcmUgYmFzaWNhbGx5IHRocmVlIGNhc2VzOlxuICAgICAgICAvLyAtIElmIHRoZXJlIGlzIG5vIHBhcmVudCBjb21wb25lbnQgKHRodXMgbm8gYHBhcmVudEluamVjdG9yYCksIHdlIGJvb3RzdHJhcCB0aGUgZG93bmdyYWRlZFxuICAgICAgICAvLyAgIGBOZ01vZHVsZWAgYW5kIHVzZSBpdHMgaW5qZWN0b3IgYXMgYm90aCBgZmluYWxNb2R1bGVJbmplY3RvcmAgYW5kXG4gICAgICAgIC8vICAgYGZpbmFsUGFyZW50SW5qZWN0b3JgLlxuICAgICAgICAvLyAtIElmIHRoZXJlIGlzIGEgcGFyZW50IGNvbXBvbmVudCAoYW5kIHRodXMgYSBgcGFyZW50SW5qZWN0b3JgKSBhbmQgd2UgYXJlIHN1cmUgdGhhdCBpdFxuICAgICAgICAvLyAgIGJlbG9uZ3MgdG8gdGhlIHNhbWUgYE5nTW9kdWxlYCBhcyB0aGlzIGRvd25ncmFkZWQgY29tcG9uZW50IChlLmcuIGJlY2F1c2UgdGhlcmUgaXMgb25seVxuICAgICAgICAvLyAgIG9uZSBkb3duZ3JhZGVkIG1vZHVsZSwgd2UgdXNlIHRoYXQgYHBhcmVudEluamVjdG9yYCBhcyBib3RoIGBmaW5hbE1vZHVsZUluamVjdG9yYCBhbmRcbiAgICAgICAgLy8gICBgZmluYWxQYXJlbnRJbmplY3RvcmAuXG4gICAgICAgIC8vIC0gSWYgdGhlcmUgaXMgYSBwYXJlbnQgY29tcG9uZW50LCBidXQgaXQgbWF5IGJlbG9uZyB0byBhIGRpZmZlcmVudCBgTmdNb2R1bGVgLCB0aGVuIHdlXG4gICAgICAgIC8vICAgdXNlIHRoZSBgcGFyZW50SW5qZWN0b3JgIGFzIGBmaW5hbFBhcmVudEluamVjdG9yYCBhbmQgdGhpcyBkb3duZ3JhZGVkIGNvbXBvbmVudCdzXG4gICAgICAgIC8vICAgZGVjbGFyaW5nIGBOZ01vZHVsZWAncyBpbmplY3RvciBhcyBgZmluYWxNb2R1bGVJbmplY3RvcmAuXG4gICAgICAgIC8vICAgTm90ZSAxOiBJZiB0aGUgYE5nTW9kdWxlYCBpcyBhbHJlYWR5IGJvb3RzdHJhcHBlZCwgd2UganVzdCBnZXQgaXRzIGluamVjdG9yICh3ZSBkb24ndFxuICAgICAgICAvLyAgICAgICAgICAgYm9vdHN0cmFwIGFnYWluKS5cbiAgICAgICAgLy8gICBOb3RlIDI6IEl0IGlzIHBvc3NpYmxlIHRoYXQgKHdoaWxlIHRoZXJlIGFyZSBtdWx0aXBsZSBkb3duZ3JhZGVkIG1vZHVsZXMpIHRoaXNcbiAgICAgICAgLy8gICAgICAgICAgIGRvd25ncmFkZWQgY29tcG9uZW50IGFuZCBpdHMgcGFyZW50IGNvbXBvbmVudCBib3RoIGJlbG9uZyB0byB0aGUgc2FtZSBOZ01vZHVsZS5cbiAgICAgICAgLy8gICAgICAgICAgIEluIHRoYXQgY2FzZSwgd2UgY291bGQgaGF2ZSB1c2VkIHRoZSBgcGFyZW50SW5qZWN0b3JgIGFzIGJvdGhcbiAgICAgICAgLy8gICAgICAgICAgIGBmaW5hbE1vZHVsZUluamVjdG9yYCBhbmQgYGZpbmFsUGFyZW50SW5qZWN0b3JgLCBidXQgKGZvciBzaW1wbGljaXR5KSB3ZSBhcmVcbiAgICAgICAgLy8gICAgICAgICAgIHRyZWF0aW5nIHRoaXMgY2FzZSBhcyBpZiB0aGV5IGJlbG9uZyB0byBkaWZmZXJlbnQgYE5nTW9kdWxlYHMuIFRoYXQgZG9lc24ndFxuICAgICAgICAvLyAgICAgICAgICAgcmVhbGx5IGFmZmVjdCBhbnl0aGluZywgc2luY2UgYHBhcmVudEluamVjdG9yYCBoYXMgYG1vZHVsZUluamVjdG9yYCBhcyBhbmNlc3RvclxuICAgICAgICAvLyAgICAgICAgICAgYW5kIHRyeWluZyB0byByZXNvbHZlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgIGZyb20gZWl0aGVyIG9uZSB3aWxsIHJldHVyblxuICAgICAgICAvLyAgICAgICAgICAgdGhlIHNhbWUgaW5zdGFuY2UuXG5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBwYXJlbnQgY29tcG9uZW50LCB1c2UgaXRzIGluamVjdG9yIGFzIHBhcmVudCBpbmplY3Rvci5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIFwidG9wLWxldmVsXCIgQW5ndWxhciBjb21wb25lbnQsIHVzZSB0aGUgbW9kdWxlIGluamVjdG9yLlxuICAgICAgICBjb25zdCBmaW5hbFBhcmVudEluamVjdG9yID0gcGFyZW50SW5qZWN0b3IgfHwgbW9kdWxlSW5qZWN0b3IhO1xuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBcInRvcC1sZXZlbFwiIEFuZ3VsYXIgY29tcG9uZW50IG9yIHRoZSBwYXJlbnQgY29tcG9uZW50IG1heSBiZWxvbmcgdG8gYVxuICAgICAgICAvLyBkaWZmZXJlbnQgYE5nTW9kdWxlYCwgdXNlIHRoZSBtb2R1bGUgaW5qZWN0b3IgZm9yIG1vZHVsZS1zcGVjaWZpYyBkZXBlbmRlbmNpZXMuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcGFyZW50IGNvbXBvbmVudCB0aGF0IGJlbG9uZ3MgdG8gdGhlIHNhbWUgYE5nTW9kdWxlYCwgdXNlIGl0cyBpbmplY3Rvci5cbiAgICAgICAgY29uc3QgZmluYWxNb2R1bGVJbmplY3RvciA9IG1vZHVsZUluamVjdG9yIHx8IHBhcmVudEluamVjdG9yITtcblxuICAgICAgICBjb25zdCBkb0Rvd25ncmFkZSA9IChpbmplY3RvcjogSW5qZWN0b3IsIG1vZHVsZUluamVjdG9yOiBJbmplY3RvcikgPT4ge1xuICAgICAgICAgIC8vIFJldHJpZXZlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgIGZyb20gdGhlIGluamVjdG9yIHRpZWQgdG8gdGhlIGBOZ01vZHVsZWAgdGhpc1xuICAgICAgICAgIC8vIGNvbXBvbmVudCBiZWxvbmdzIHRvLlxuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyID1cbiAgICAgICAgICAgICAgbW9kdWxlSW5qZWN0b3IuZ2V0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+ID1cbiAgICAgICAgICAgICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGluZm8uY29tcG9uZW50KSE7XG5cbiAgICAgICAgICBpZiAoIWNvbXBvbmVudEZhY3RvcnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nIENvbXBvbmVudEZhY3RvcnkgZm9yOiAke2dldFR5cGVOYW1lKGluZm8uY29tcG9uZW50KX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpbmplY3RvclByb21pc2UgPSBuZXcgUGFyZW50SW5qZWN0b3JQcm9taXNlKGVsZW1lbnQpO1xuICAgICAgICAgIGNvbnN0IGZhY2FkZSA9IG5ldyBEb3duZ3JhZGVDb21wb25lbnRBZGFwdGVyKFxuICAgICAgICAgICAgICBlbGVtZW50LCBhdHRycywgc2NvcGUsIG5nTW9kZWwsIGluamVjdG9yLCAkaW5qZWN0b3IsICRjb21waWxlLCAkcGFyc2UsXG4gICAgICAgICAgICAgIGNvbXBvbmVudEZhY3RvcnksIHdyYXBDYWxsYmFjayk7XG5cbiAgICAgICAgICBjb25zdCBwcm9qZWN0YWJsZU5vZGVzID0gZmFjYWRlLmNvbXBpbGVDb250ZW50cygpO1xuICAgICAgICAgIGZhY2FkZS5jcmVhdGVDb21wb25lbnQocHJvamVjdGFibGVOb2Rlcyk7XG4gICAgICAgICAgZmFjYWRlLnNldHVwSW5wdXRzKGlzTmdVcGdyYWRlTGl0ZSwgaW5mby5wcm9wYWdhdGVEaWdlc3QpO1xuICAgICAgICAgIGZhY2FkZS5zZXR1cE91dHB1dHMoKTtcbiAgICAgICAgICBmYWNhZGUucmVnaXN0ZXJDbGVhbnVwKCk7XG5cbiAgICAgICAgICBpbmplY3RvclByb21pc2UucmVzb2x2ZShmYWNhZGUuZ2V0SW5qZWN0b3IoKSk7XG5cbiAgICAgICAgICBpZiAocmFuQXN5bmMpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgcnVuIGFzeW5jLCBpdCBpcyBwb3NzaWJsZSB0aGF0IGl0IGlzIG5vdCBydW4gaW5zaWRlIGFcbiAgICAgICAgICAgIC8vIGRpZ2VzdCBhbmQgaW5pdGlhbCBpbnB1dCB2YWx1ZXMgd2lsbCBub3QgYmUgZGV0ZWN0ZWQuXG4gICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKCgpID0+IHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZG93bmdyYWRlRm4gPVxuICAgICAgICAgICAgIWlzTmdVcGdyYWRlTGl0ZSA/IGRvRG93bmdyYWRlIDogKHBJbmplY3RvcjogSW5qZWN0b3IsIG1JbmplY3RvcjogSW5qZWN0b3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFuZ1pvbmUpIHtcbiAgICAgICAgICAgICAgICBuZ1pvbmUgPSBwSW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB3cmFwQ2FsbGJhY2soKCkgPT4gZG9Eb3duZ3JhZGUocEluamVjdG9yLCBtSW5qZWN0b3IpKSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAvLyBOT1RFOlxuICAgICAgICAvLyBOb3QgdXNpbmcgYFBhcmVudEluamVjdG9yUHJvbWlzZS5hbGwoKWAgKHdoaWNoIGlzIGluaGVyaXRlZCBmcm9tIGBTeW5jUHJvbWlzZWApLCBiZWNhdXNlXG4gICAgICAgIC8vIENsb3N1cmUgQ29tcGlsZXIgKG9yIHNvbWUgcmVsYXRlZCB0b29sKSBjb21wbGFpbnM6XG4gICAgICAgIC8vIGBUeXBlRXJyb3I6IC4uLiRzcmMkZG93bmdyYWRlX2NvbXBvbmVudF9QYXJlbnRJbmplY3RvclByb21pc2UuYWxsIGlzIG5vdCBhIGZ1bmN0aW9uYFxuICAgICAgICBTeW5jUHJvbWlzZS5hbGwoW2ZpbmFsUGFyZW50SW5qZWN0b3IsIGZpbmFsTW9kdWxlSW5qZWN0b3JdKVxuICAgICAgICAgICAgLnRoZW4oKFtwSW5qZWN0b3IsIG1JbmplY3Rvcl0pID0+IGRvd25ncmFkZUZuKHBJbmplY3RvciwgbUluamVjdG9yKSk7XG5cbiAgICAgICAgcmFuQXN5bmMgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gYnJhY2tldC1ub3RhdGlvbiBiZWNhdXNlIG9mIGNsb3N1cmUgLSBzZWUgIzE0NDQxXG4gIGRpcmVjdGl2ZUZhY3RvcnlbJyRpbmplY3QnXSA9IFskQ09NUElMRSwgJElOSkVDVE9SLCAkUEFSU0VdO1xuICByZXR1cm4gZGlyZWN0aXZlRmFjdG9yeTtcbn1cblxuLyoqXG4gKiBTeW5jaHJvbm91cyBwcm9taXNlLWxpa2Ugb2JqZWN0IHRvIHdyYXAgcGFyZW50IGluamVjdG9ycyxcbiAqIHRvIHByZXNlcnZlIHRoZSBzeW5jaHJvbm91cyBuYXR1cmUgb2YgQW5ndWxhckpTJ3MgYCRjb21waWxlYC5cbiAqL1xuY2xhc3MgUGFyZW50SW5qZWN0b3JQcm9taXNlIGV4dGVuZHMgU3luY1Byb21pc2U8SW5qZWN0b3I+IHtcbiAgcHJpdmF0ZSBpbmplY3RvcktleTogc3RyaW5nID0gY29udHJvbGxlcktleShJTkpFQ1RPUl9LRVkpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBTdG9yZSB0aGUgcHJvbWlzZSBvbiB0aGUgZWxlbWVudC5cbiAgICBlbGVtZW50LmRhdGEhKHRoaXMuaW5qZWN0b3JLZXksIHRoaXMpO1xuICB9XG5cbiAgcmVzb2x2ZShpbmplY3RvcjogSW5qZWN0b3IpOiB2b2lkIHtcbiAgICAvLyBTdG9yZSB0aGUgcmVhbCBpbmplY3RvciBvbiB0aGUgZWxlbWVudC5cbiAgICB0aGlzLmVsZW1lbnQuZGF0YSEodGhpcy5pbmplY3RvcktleSwgaW5qZWN0b3IpO1xuXG4gICAgLy8gUmVsZWFzZSB0aGUgZWxlbWVudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy5cbiAgICB0aGlzLmVsZW1lbnQgPSBudWxsITtcblxuICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2UuXG4gICAgc3VwZXIucmVzb2x2ZShpbmplY3Rvcik7XG4gIH1cbn1cbiJdfQ==