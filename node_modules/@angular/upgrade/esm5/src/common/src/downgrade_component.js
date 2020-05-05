/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read } from "tslib";
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
    var directiveFactory = function ($compile, $injector, $parse) {
        // When using `downgradeModule()`, we need to handle certain things specially. For example:
        // - We always need to attach the component view to the `ApplicationRef` for it to be
        //   dirty-checked.
        // - We need to ensure callbacks to Angular APIs (e.g. change detection) are run inside the
        //   Angular zone.
        //   NOTE: This is not needed, when using `UpgradeModule`, because `$digest()` will be run
        //         inside the Angular zone (except if explicitly escaped, in which case we shouldn't
        //         force it back in).
        var isNgUpgradeLite = getUpgradeAppType($injector) === 3 /* Lite */;
        var wrapCallback = !isNgUpgradeLite ? function (cb) { return cb; } : function (cb) { return function () { return NgZone.isInAngularZone() ? cb() : ngZone.run(cb); }; };
        var ngZone;
        // When downgrading multiple modules, special handling is needed wrt injectors.
        var hasMultipleDowngradedModules = isNgUpgradeLite && (getDowngradedModuleCount($injector) > 1);
        return {
            restrict: 'E',
            terminal: true,
            require: [REQUIRE_INJECTOR, REQUIRE_NG_MODEL],
            link: function (scope, element, attrs, required) {
                // We might have to compile the contents asynchronously, because this might have been
                // triggered by `UpgradeNg1ComponentAdapterBuilder`, before the Angular templates have
                // been compiled.
                var ngModel = required[1];
                var parentInjector = required[0];
                var moduleInjector = undefined;
                var ranAsync = false;
                if (!parentInjector || hasMultipleDowngradedModules) {
                    var downgradedModule = info.downgradedModule || '';
                    var lazyModuleRefKey = "" + LAZY_MODULE_REF + downgradedModule;
                    var attemptedAction = "instantiating component '" + getTypeName(info.component) + "'";
                    validateInjectionKey($injector, downgradedModule, lazyModuleRefKey, attemptedAction);
                    var lazyModuleRef = $injector.get(lazyModuleRefKey);
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
                var finalParentInjector = parentInjector || moduleInjector;
                // If this is a "top-level" Angular component or the parent component may belong to a
                // different `NgModule`, use the module injector for module-specific dependencies.
                // If there is a parent component that belongs to the same `NgModule`, use its injector.
                var finalModuleInjector = moduleInjector || parentInjector;
                var doDowngrade = function (injector, moduleInjector) {
                    // Retrieve `ComponentFactoryResolver` from the injector tied to the `NgModule` this
                    // component belongs to.
                    var componentFactoryResolver = moduleInjector.get(ComponentFactoryResolver);
                    var componentFactory = componentFactoryResolver.resolveComponentFactory(info.component);
                    if (!componentFactory) {
                        throw new Error("Expecting ComponentFactory for: " + getTypeName(info.component));
                    }
                    var injectorPromise = new ParentInjectorPromise(element);
                    var facade = new DowngradeComponentAdapter(element, attrs, scope, ngModel, injector, $injector, $compile, $parse, componentFactory, wrapCallback);
                    var projectableNodes = facade.compileContents();
                    facade.createComponent(projectableNodes);
                    facade.setupInputs(isNgUpgradeLite, info.propagateDigest);
                    facade.setupOutputs();
                    facade.registerCleanup();
                    injectorPromise.resolve(facade.getInjector());
                    if (ranAsync) {
                        // If this is run async, it is possible that it is not run inside a
                        // digest and initial input values will not be detected.
                        scope.$evalAsync(function () { });
                    }
                };
                var downgradeFn = !isNgUpgradeLite ? doDowngrade : function (pInjector, mInjector) {
                    if (!ngZone) {
                        ngZone = pInjector.get(NgZone);
                    }
                    wrapCallback(function () { return doDowngrade(pInjector, mInjector); })();
                };
                // NOTE:
                // Not using `ParentInjectorPromise.all()` (which is inherited from `SyncPromise`), because
                // Closure Compiler (or some related tool) complains:
                // `TypeError: ...$src$downgrade_component_ParentInjectorPromise.all is not a function`
                SyncPromise.all([finalParentInjector, finalModuleInjector])
                    .then(function (_a) {
                    var _b = __read(_a, 2), pInjector = _b[0], mInjector = _b[1];
                    return downgradeFn(pInjector, mInjector);
                });
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
var ParentInjectorPromise = /** @class */ (function (_super) {
    __extends(ParentInjectorPromise, _super);
    function ParentInjectorPromise(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.injectorKey = controllerKey(INJECTOR_KEY);
        // Store the promise on the element.
        element.data(_this.injectorKey, _this);
        return _this;
    }
    ParentInjectorPromise.prototype.resolve = function (injector) {
        // Store the real injector on the element.
        this.element.data(this.injectorKey, injector);
        // Release the element to prevent memory leaks.
        this.element = null;
        // Resolve the promise.
        _super.prototype.resolve.call(this, injector);
    };
    return ParentInjectorPromise;
}(SyncPromise));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2NvbW1vbi9zcmMvZG93bmdyYWRlX2NvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFtQix3QkFBd0IsRUFBWSxNQUFNLEVBQU8sTUFBTSxlQUFlLENBQUM7QUFHakcsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDM0gsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFdBQVcsRUFBVyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxhQUFhLEVBQUUsd0JBQXdCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFpQyxvQkFBb0IsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUdwSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLElBVWxDO0lBQ0MsSUFBTSxnQkFBZ0IsR0FBdUIsVUFDekMsUUFBeUIsRUFBRSxTQUEyQixFQUFFLE1BQXFCO1FBQy9FLDJGQUEyRjtRQUMzRixxRkFBcUY7UUFDckYsbUJBQW1CO1FBQ25CLDJGQUEyRjtRQUMzRixrQkFBa0I7UUFDbEIsMEZBQTBGO1FBQzFGLDRGQUE0RjtRQUM1Riw2QkFBNkI7UUFDN0IsSUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLGlCQUF3QixDQUFDO1FBQzdFLElBQU0sWUFBWSxHQUNkLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxVQUFB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QUFDO1FBRS9DLCtDQUErQztRQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUssQ0FBQztRQUVyQix1QkFBdUI7UUFDdkIsaUJBQU0sT0FBTyxZQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFwQkQsQ0FBb0MsV0FBVyxHQW9COUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeSwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBJbmplY3RvciwgTmdab25lLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtJQW5ub3RhdGVkRnVuY3Rpb24sIElBdHRyaWJ1dGVzLCBJQXVnbWVudGVkSlF1ZXJ5LCBJQ29tcGlsZVNlcnZpY2UsIElEaXJlY3RpdmUsIElJbmplY3RvclNlcnZpY2UsIElOZ01vZGVsQ29udHJvbGxlciwgSVBhcnNlU2VydmljZSwgSVNjb3BlfSBmcm9tICcuL2FuZ3VsYXIxJztcbmltcG9ydCB7JENPTVBJTEUsICRJTkpFQ1RPUiwgJFBBUlNFLCBJTkpFQ1RPUl9LRVksIExBWllfTU9EVUxFX1JFRiwgUkVRVUlSRV9JTkpFQ1RPUiwgUkVRVUlSRV9OR19NT0RFTH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtEb3duZ3JhZGVDb21wb25lbnRBZGFwdGVyfSBmcm9tICcuL2Rvd25ncmFkZV9jb21wb25lbnRfYWRhcHRlcic7XG5pbXBvcnQge1N5bmNQcm9taXNlLCBUaGVuYWJsZX0gZnJvbSAnLi9wcm9taXNlX3V0aWwnO1xuaW1wb3J0IHtjb250cm9sbGVyS2V5LCBnZXREb3duZ3JhZGVkTW9kdWxlQ291bnQsIGdldFR5cGVOYW1lLCBnZXRVcGdyYWRlQXBwVHlwZSwgTGF6eU1vZHVsZVJlZiwgVXBncmFkZUFwcFR5cGUsIHZhbGlkYXRlSW5qZWN0aW9uS2V5fSBmcm9tICcuL3V0aWwnO1xuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhbGxvd3MgYW4gQW5ndWxhciBjb21wb25lbnQgdG8gYmUgdXNlZCBmcm9tIEFuZ3VsYXJKUy5cbiAqXG4gKiAqUGFydCBvZiB0aGUgW3VwZ3JhZGUvc3RhdGljXShhcGk/cXVlcnk9dXBncmFkZSUyRnN0YXRpYylcbiAqIGxpYnJhcnkgZm9yIGh5YnJpZCB1cGdyYWRlIGFwcHMgdGhhdCBzdXBwb3J0IEFPVCBjb21waWxhdGlvbipcbiAqXG4gKiBUaGlzIGhlbHBlciBmdW5jdGlvbiByZXR1cm5zIGEgZmFjdG9yeSBmdW5jdGlvbiB0byBiZSB1c2VkIGZvciByZWdpc3RlcmluZ1xuICogYW4gQW5ndWxhckpTIHdyYXBwZXIgZGlyZWN0aXZlIGZvciBcImRvd25ncmFkaW5nXCIgYW4gQW5ndWxhciBjb21wb25lbnQuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqICMjIyBFeGFtcGxlc1xuICpcbiAqIExldCdzIGFzc3VtZSB0aGF0IHlvdSBoYXZlIGFuIEFuZ3VsYXIgY29tcG9uZW50IGNhbGxlZCBgbmcySGVyb2VzYCB0aGF0IG5lZWRzXG4gKiB0byBiZSBtYWRlIGF2YWlsYWJsZSBpbiBBbmd1bGFySlMgdGVtcGxhdGVzLlxuICpcbiAqIHtAZXhhbXBsZSB1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS50cyByZWdpb249XCJuZzItaGVyb2VzXCJ9XG4gKlxuICogV2UgbXVzdCBjcmVhdGUgYW4gQW5ndWxhckpTIFtkaXJlY3RpdmVdKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2d1aWRlL2RpcmVjdGl2ZSlcbiAqIHRoYXQgd2lsbCBtYWtlIHRoaXMgQW5ndWxhciBjb21wb25lbnQgYXZhaWxhYmxlIGluc2lkZSBBbmd1bGFySlMgdGVtcGxhdGVzLlxuICogVGhlIGBkb3duZ3JhZGVDb21wb25lbnQoKWAgZnVuY3Rpb24gcmV0dXJucyBhIGZhY3RvcnkgZnVuY3Rpb24gdGhhdCB3ZVxuICogY2FuIHVzZSB0byBkZWZpbmUgdGhlIEFuZ3VsYXJKUyBkaXJlY3RpdmUgdGhhdCB3cmFwcyB0aGUgXCJkb3duZ3JhZGVkXCIgY29tcG9uZW50LlxuICpcbiAqIHtAZXhhbXBsZSB1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS50cyByZWdpb249XCJuZzItaGVyb2VzLXdyYXBwZXJcIn1cbiAqXG4gKiBGb3IgbW9yZSBkZXRhaWxzIGFuZCBleGFtcGxlcyBvbiBkb3duZ3JhZGluZyBBbmd1bGFyIGNvbXBvbmVudHMgdG8gQW5ndWxhckpTIGNvbXBvbmVudHMgcGxlYXNlXG4gKiB2aXNpdCB0aGUgW1VwZ3JhZGUgZ3VpZGVdKGd1aWRlL3VwZ3JhZGUjdXNpbmctYW5ndWxhci1jb21wb25lbnRzLWZyb20tYW5ndWxhcmpzLWNvZGUpLlxuICpcbiAqIEBwYXJhbSBpbmZvIGNvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBDb21wb25lbnQgdGhhdCBpcyBiZWluZyBkb3duZ3JhZGVkOlxuICpcbiAqIC0gYGNvbXBvbmVudDogVHlwZTxhbnk+YDogVGhlIHR5cGUgb2YgdGhlIENvbXBvbmVudCB0aGF0IHdpbGwgYmUgZG93bmdyYWRlZFxuICogLSBgZG93bmdyYWRlZE1vZHVsZT86IHN0cmluZ2A6IFRoZSBuYW1lIG9mIHRoZSBkb3duZ3JhZGVkIG1vZHVsZSAoaWYgYW55KSB0aGF0IHRoZSBjb21wb25lbnRcbiAqICAgXCJiZWxvbmdzIHRvXCIsIGFzIHJldHVybmVkIGJ5IGEgY2FsbCB0byBgZG93bmdyYWRlTW9kdWxlKClgLiBJdCBpcyB0aGUgbW9kdWxlLCB3aG9zZVxuICogICBjb3JyZXNwb25kaW5nIEFuZ3VsYXIgbW9kdWxlIHdpbGwgYmUgYm9vdHN0cmFwcGVkLCB3aGVuIHRoZSBjb21wb25lbnQgbmVlZHMgdG8gYmUgaW5zdGFudGlhdGVkLlxuICogICA8YnIgLz5cbiAqICAgKFRoaXMgb3B0aW9uIGlzIG9ubHkgbmVjZXNzYXJ5IHdoZW4gdXNpbmcgYGRvd25ncmFkZU1vZHVsZSgpYCB0byBkb3duZ3JhZGUgbW9yZSB0aGFuIG9uZVxuICogICBBbmd1bGFyIG1vZHVsZS4pXG4gKiAtIGBwcm9wYWdhdGVEaWdlc3Q/OiBib29sZWFuYDogV2hldGhlciB0byBwZXJmb3JtIHtAbGluayBDaGFuZ2VEZXRlY3RvclJlZiNkZXRlY3RDaGFuZ2VzXG4gKiAgIGNoYW5nZSBkZXRlY3Rpb259IG9uIHRoZSBjb21wb25lbnQgb24gZXZlcnlcbiAqICAgWyRkaWdlc3RdKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy90eXBlLyRyb290U2NvcGUuU2NvcGUjJGRpZ2VzdCkuIElmIHNldCB0byBgZmFsc2VgLFxuICogICBjaGFuZ2UgZGV0ZWN0aW9uIHdpbGwgc3RpbGwgYmUgcGVyZm9ybWVkIHdoZW4gYW55IG9mIHRoZSBjb21wb25lbnQncyBpbnB1dHMgY2hhbmdlcy5cbiAqICAgKERlZmF1bHQ6IHRydWUpXG4gKlxuICogQHJldHVybnMgYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVnaXN0ZXIgdGhlIGNvbXBvbmVudCBpbiBhblxuICogQW5ndWxhckpTIG1vZHVsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb3duZ3JhZGVDb21wb25lbnQoaW5mbzoge1xuICBjb21wb25lbnQ6IFR5cGU8YW55PjtcbiAgZG93bmdyYWRlZE1vZHVsZT86IHN0cmluZztcbiAgcHJvcGFnYXRlRGlnZXN0PzogYm9vbGVhbjtcbiAgLyoqIEBkZXByZWNhdGVkIHNpbmNlIHY0LiBUaGlzIHBhcmFtZXRlciBpcyBubyBsb25nZXIgdXNlZCAqL1xuICBpbnB1dHM/OiBzdHJpbmdbXTtcbiAgLyoqIEBkZXByZWNhdGVkIHNpbmNlIHY0LiBUaGlzIHBhcmFtZXRlciBpcyBubyBsb25nZXIgdXNlZCAqL1xuICBvdXRwdXRzPzogc3RyaW5nW107XG4gIC8qKiBAZGVwcmVjYXRlZCBzaW5jZSB2NC4gVGhpcyBwYXJhbWV0ZXIgaXMgbm8gbG9uZ2VyIHVzZWQgKi9cbiAgc2VsZWN0b3JzPzogc3RyaW5nW107XG59KTogYW55IC8qIGFuZ3VsYXIuSUluamVjdGFibGUgKi8ge1xuICBjb25zdCBkaXJlY3RpdmVGYWN0b3J5OiBJQW5ub3RhdGVkRnVuY3Rpb24gPSBmdW5jdGlvbihcbiAgICAgICRjb21waWxlOiBJQ29tcGlsZVNlcnZpY2UsICRpbmplY3RvcjogSUluamVjdG9yU2VydmljZSwgJHBhcnNlOiBJUGFyc2VTZXJ2aWNlKTogSURpcmVjdGl2ZSB7XG4gICAgLy8gV2hlbiB1c2luZyBgZG93bmdyYWRlTW9kdWxlKClgLCB3ZSBuZWVkIHRvIGhhbmRsZSBjZXJ0YWluIHRoaW5ncyBzcGVjaWFsbHkuIEZvciBleGFtcGxlOlxuICAgIC8vIC0gV2UgYWx3YXlzIG5lZWQgdG8gYXR0YWNoIHRoZSBjb21wb25lbnQgdmlldyB0byB0aGUgYEFwcGxpY2F0aW9uUmVmYCBmb3IgaXQgdG8gYmVcbiAgICAvLyAgIGRpcnR5LWNoZWNrZWQuXG4gICAgLy8gLSBXZSBuZWVkIHRvIGVuc3VyZSBjYWxsYmFja3MgdG8gQW5ndWxhciBBUElzIChlLmcuIGNoYW5nZSBkZXRlY3Rpb24pIGFyZSBydW4gaW5zaWRlIHRoZVxuICAgIC8vICAgQW5ndWxhciB6b25lLlxuICAgIC8vICAgTk9URTogVGhpcyBpcyBub3QgbmVlZGVkLCB3aGVuIHVzaW5nIGBVcGdyYWRlTW9kdWxlYCwgYmVjYXVzZSBgJGRpZ2VzdCgpYCB3aWxsIGJlIHJ1blxuICAgIC8vICAgICAgICAgaW5zaWRlIHRoZSBBbmd1bGFyIHpvbmUgKGV4Y2VwdCBpZiBleHBsaWNpdGx5IGVzY2FwZWQsIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkbid0XG4gICAgLy8gICAgICAgICBmb3JjZSBpdCBiYWNrIGluKS5cbiAgICBjb25zdCBpc05nVXBncmFkZUxpdGUgPSBnZXRVcGdyYWRlQXBwVHlwZSgkaW5qZWN0b3IpID09PSBVcGdyYWRlQXBwVHlwZS5MaXRlO1xuICAgIGNvbnN0IHdyYXBDYWxsYmFjazogPFQ+KGNiOiAoKSA9PiBUKSA9PiB0eXBlb2YgY2IgPVxuICAgICAgICAhaXNOZ1VwZ3JhZGVMaXRlID8gY2IgPT4gY2IgOiBjYiA9PiAoKSA9PiBOZ1pvbmUuaXNJbkFuZ3VsYXJab25lKCkgPyBjYigpIDogbmdab25lLnJ1bihjYik7XG4gICAgbGV0IG5nWm9uZTogTmdab25lO1xuXG4gICAgLy8gV2hlbiBkb3duZ3JhZGluZyBtdWx0aXBsZSBtb2R1bGVzLCBzcGVjaWFsIGhhbmRsaW5nIGlzIG5lZWRlZCB3cnQgaW5qZWN0b3JzLlxuICAgIGNvbnN0IGhhc011bHRpcGxlRG93bmdyYWRlZE1vZHVsZXMgPVxuICAgICAgICBpc05nVXBncmFkZUxpdGUgJiYgKGdldERvd25ncmFkZWRNb2R1bGVDb3VudCgkaW5qZWN0b3IpID4gMSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgcmVxdWlyZTogW1JFUVVJUkVfSU5KRUNUT1IsIFJFUVVJUkVfTkdfTU9ERUxdLFxuICAgICAgbGluazogKHNjb3BlOiBJU2NvcGUsIGVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnksIGF0dHJzOiBJQXR0cmlidXRlcywgcmVxdWlyZWQ6IGFueVtdKSA9PiB7XG4gICAgICAgIC8vIFdlIG1pZ2h0IGhhdmUgdG8gY29tcGlsZSB0aGUgY29udGVudHMgYXN5bmNocm9ub3VzbHksIGJlY2F1c2UgdGhpcyBtaWdodCBoYXZlIGJlZW5cbiAgICAgICAgLy8gdHJpZ2dlcmVkIGJ5IGBVcGdyYWRlTmcxQ29tcG9uZW50QWRhcHRlckJ1aWxkZXJgLCBiZWZvcmUgdGhlIEFuZ3VsYXIgdGVtcGxhdGVzIGhhdmVcbiAgICAgICAgLy8gYmVlbiBjb21waWxlZC5cblxuICAgICAgICBjb25zdCBuZ01vZGVsOiBJTmdNb2RlbENvbnRyb2xsZXIgPSByZXF1aXJlZFsxXTtcbiAgICAgICAgY29uc3QgcGFyZW50SW5qZWN0b3I6IEluamVjdG9yfFRoZW5hYmxlPEluamVjdG9yPnx1bmRlZmluZWQgPSByZXF1aXJlZFswXTtcbiAgICAgICAgbGV0IG1vZHVsZUluamVjdG9yOiBJbmplY3RvcnxUaGVuYWJsZTxJbmplY3Rvcj58dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmFuQXN5bmMgPSBmYWxzZTtcblxuICAgICAgICBpZiAoIXBhcmVudEluamVjdG9yIHx8IGhhc011bHRpcGxlRG93bmdyYWRlZE1vZHVsZXMpIHtcbiAgICAgICAgICBjb25zdCBkb3duZ3JhZGVkTW9kdWxlID0gaW5mby5kb3duZ3JhZGVkTW9kdWxlIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGxhenlNb2R1bGVSZWZLZXkgPSBgJHtMQVpZX01PRFVMRV9SRUZ9JHtkb3duZ3JhZGVkTW9kdWxlfWA7XG4gICAgICAgICAgY29uc3QgYXR0ZW1wdGVkQWN0aW9uID0gYGluc3RhbnRpYXRpbmcgY29tcG9uZW50ICcke2dldFR5cGVOYW1lKGluZm8uY29tcG9uZW50KX0nYDtcblxuICAgICAgICAgIHZhbGlkYXRlSW5qZWN0aW9uS2V5KCRpbmplY3RvciwgZG93bmdyYWRlZE1vZHVsZSwgbGF6eU1vZHVsZVJlZktleSwgYXR0ZW1wdGVkQWN0aW9uKTtcblxuICAgICAgICAgIGNvbnN0IGxhenlNb2R1bGVSZWYgPSAkaW5qZWN0b3IuZ2V0KGxhenlNb2R1bGVSZWZLZXkpIGFzIExhenlNb2R1bGVSZWY7XG4gICAgICAgICAgbW9kdWxlSW5qZWN0b3IgPSBsYXp5TW9kdWxlUmVmLmluamVjdG9yIHx8IGxhenlNb2R1bGVSZWYucHJvbWlzZSBhcyBQcm9taXNlPEluamVjdG9yPjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGVzOlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGVyZSBhcmUgdHdvIGluamVjdG9yczogYGZpbmFsTW9kdWxlSW5qZWN0b3JgIGFuZCBgZmluYWxQYXJlbnRJbmplY3RvcmAgKHRoZXkgbWlnaHQgYmVcbiAgICAgICAgLy8gdGhlIHNhbWUgaW5zdGFuY2UsIGJ1dCB0aGF0IGlzIGlycmVsZXZhbnQpOlxuICAgICAgICAvLyAtIGBmaW5hbE1vZHVsZUluamVjdG9yYCBpcyB1c2VkIHRvIHJldHJpZXZlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgLCB0aHVzIGl0IG11c3QgYmVcbiAgICAgICAgLy8gICBvbiB0aGUgc2FtZSB0cmVlIGFzIHRoZSBgTmdNb2R1bGVgIHRoYXQgZGVjbGFyZXMgdGhpcyBkb3duZ3JhZGVkIGNvbXBvbmVudC5cbiAgICAgICAgLy8gLSBgZmluYWxQYXJlbnRJbmplY3RvcmAgaXMgdXNlZCBmb3IgYWxsIG90aGVyIGluamVjdGlvbiBwdXJwb3Nlcy5cbiAgICAgICAgLy8gICAoTm90ZSB0aGF0IEFuZ3VsYXIga25vd3MgdG8gb25seSB0cmF2ZXJzZSB0aGUgY29tcG9uZW50LXRyZWUgcGFydCBvZiB0aGF0IGluamVjdG9yLFxuICAgICAgICAvLyAgIHdoZW4gbG9va2luZyBmb3IgYW4gaW5qZWN0YWJsZSBhbmQgdGhlbiBzd2l0Y2ggdG8gdGhlIG1vZHVsZSBpbmplY3Rvci4pXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZXJlIGFyZSBiYXNpY2FsbHkgdGhyZWUgY2FzZXM6XG4gICAgICAgIC8vIC0gSWYgdGhlcmUgaXMgbm8gcGFyZW50IGNvbXBvbmVudCAodGh1cyBubyBgcGFyZW50SW5qZWN0b3JgKSwgd2UgYm9vdHN0cmFwIHRoZSBkb3duZ3JhZGVkXG4gICAgICAgIC8vICAgYE5nTW9kdWxlYCBhbmQgdXNlIGl0cyBpbmplY3RvciBhcyBib3RoIGBmaW5hbE1vZHVsZUluamVjdG9yYCBhbmRcbiAgICAgICAgLy8gICBgZmluYWxQYXJlbnRJbmplY3RvcmAuXG4gICAgICAgIC8vIC0gSWYgdGhlcmUgaXMgYSBwYXJlbnQgY29tcG9uZW50IChhbmQgdGh1cyBhIGBwYXJlbnRJbmplY3RvcmApIGFuZCB3ZSBhcmUgc3VyZSB0aGF0IGl0XG4gICAgICAgIC8vICAgYmVsb25ncyB0byB0aGUgc2FtZSBgTmdNb2R1bGVgIGFzIHRoaXMgZG93bmdyYWRlZCBjb21wb25lbnQgKGUuZy4gYmVjYXVzZSB0aGVyZSBpcyBvbmx5XG4gICAgICAgIC8vICAgb25lIGRvd25ncmFkZWQgbW9kdWxlLCB3ZSB1c2UgdGhhdCBgcGFyZW50SW5qZWN0b3JgIGFzIGJvdGggYGZpbmFsTW9kdWxlSW5qZWN0b3JgIGFuZFxuICAgICAgICAvLyAgIGBmaW5hbFBhcmVudEluamVjdG9yYC5cbiAgICAgICAgLy8gLSBJZiB0aGVyZSBpcyBhIHBhcmVudCBjb21wb25lbnQsIGJ1dCBpdCBtYXkgYmVsb25nIHRvIGEgZGlmZmVyZW50IGBOZ01vZHVsZWAsIHRoZW4gd2VcbiAgICAgICAgLy8gICB1c2UgdGhlIGBwYXJlbnRJbmplY3RvcmAgYXMgYGZpbmFsUGFyZW50SW5qZWN0b3JgIGFuZCB0aGlzIGRvd25ncmFkZWQgY29tcG9uZW50J3NcbiAgICAgICAgLy8gICBkZWNsYXJpbmcgYE5nTW9kdWxlYCdzIGluamVjdG9yIGFzIGBmaW5hbE1vZHVsZUluamVjdG9yYC5cbiAgICAgICAgLy8gICBOb3RlIDE6IElmIHRoZSBgTmdNb2R1bGVgIGlzIGFscmVhZHkgYm9vdHN0cmFwcGVkLCB3ZSBqdXN0IGdldCBpdHMgaW5qZWN0b3IgKHdlIGRvbid0XG4gICAgICAgIC8vICAgICAgICAgICBib290c3RyYXAgYWdhaW4pLlxuICAgICAgICAvLyAgIE5vdGUgMjogSXQgaXMgcG9zc2libGUgdGhhdCAod2hpbGUgdGhlcmUgYXJlIG11bHRpcGxlIGRvd25ncmFkZWQgbW9kdWxlcykgdGhpc1xuICAgICAgICAvLyAgICAgICAgICAgZG93bmdyYWRlZCBjb21wb25lbnQgYW5kIGl0cyBwYXJlbnQgY29tcG9uZW50IGJvdGggYmVsb25nIHRvIHRoZSBzYW1lIE5nTW9kdWxlLlxuICAgICAgICAvLyAgICAgICAgICAgSW4gdGhhdCBjYXNlLCB3ZSBjb3VsZCBoYXZlIHVzZWQgdGhlIGBwYXJlbnRJbmplY3RvcmAgYXMgYm90aFxuICAgICAgICAvLyAgICAgICAgICAgYGZpbmFsTW9kdWxlSW5qZWN0b3JgIGFuZCBgZmluYWxQYXJlbnRJbmplY3RvcmAsIGJ1dCAoZm9yIHNpbXBsaWNpdHkpIHdlIGFyZVxuICAgICAgICAvLyAgICAgICAgICAgdHJlYXRpbmcgdGhpcyBjYXNlIGFzIGlmIHRoZXkgYmVsb25nIHRvIGRpZmZlcmVudCBgTmdNb2R1bGVgcy4gVGhhdCBkb2Vzbid0XG4gICAgICAgIC8vICAgICAgICAgICByZWFsbHkgYWZmZWN0IGFueXRoaW5nLCBzaW5jZSBgcGFyZW50SW5qZWN0b3JgIGhhcyBgbW9kdWxlSW5qZWN0b3JgIGFzIGFuY2VzdG9yXG4gICAgICAgIC8vICAgICAgICAgICBhbmQgdHJ5aW5nIHRvIHJlc29sdmUgYENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcmAgZnJvbSBlaXRoZXIgb25lIHdpbGwgcmV0dXJuXG4gICAgICAgIC8vICAgICAgICAgICB0aGUgc2FtZSBpbnN0YW5jZS5cblxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHBhcmVudCBjb21wb25lbnQsIHVzZSBpdHMgaW5qZWN0b3IgYXMgcGFyZW50IGluamVjdG9yLlxuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgXCJ0b3AtbGV2ZWxcIiBBbmd1bGFyIGNvbXBvbmVudCwgdXNlIHRoZSBtb2R1bGUgaW5qZWN0b3IuXG4gICAgICAgIGNvbnN0IGZpbmFsUGFyZW50SW5qZWN0b3IgPSBwYXJlbnRJbmplY3RvciB8fCBtb2R1bGVJbmplY3RvciE7XG5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIFwidG9wLWxldmVsXCIgQW5ndWxhciBjb21wb25lbnQgb3IgdGhlIHBhcmVudCBjb21wb25lbnQgbWF5IGJlbG9uZyB0byBhXG4gICAgICAgIC8vIGRpZmZlcmVudCBgTmdNb2R1bGVgLCB1c2UgdGhlIG1vZHVsZSBpbmplY3RvciBmb3IgbW9kdWxlLXNwZWNpZmljIGRlcGVuZGVuY2llcy5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBwYXJlbnQgY29tcG9uZW50IHRoYXQgYmVsb25ncyB0byB0aGUgc2FtZSBgTmdNb2R1bGVgLCB1c2UgaXRzIGluamVjdG9yLlxuICAgICAgICBjb25zdCBmaW5hbE1vZHVsZUluamVjdG9yID0gbW9kdWxlSW5qZWN0b3IgfHwgcGFyZW50SW5qZWN0b3IhO1xuXG4gICAgICAgIGNvbnN0IGRvRG93bmdyYWRlID0gKGluamVjdG9yOiBJbmplY3RvciwgbW9kdWxlSW5qZWN0b3I6IEluamVjdG9yKSA9PiB7XG4gICAgICAgICAgLy8gUmV0cmlldmUgYENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcmAgZnJvbSB0aGUgaW5qZWN0b3IgdGllZCB0byB0aGUgYE5nTW9kdWxlYCB0aGlzXG4gICAgICAgICAgLy8gY29tcG9uZW50IGJlbG9uZ3MgdG8uXG4gICAgICAgICAgY29uc3QgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgPVxuICAgICAgICAgICAgICBtb2R1bGVJbmplY3Rvci5nZXQoQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKTtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT4gPVxuICAgICAgICAgICAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoaW5mby5jb21wb25lbnQpITtcblxuICAgICAgICAgIGlmICghY29tcG9uZW50RmFjdG9yeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RpbmcgQ29tcG9uZW50RmFjdG9yeSBmb3I6ICR7Z2V0VHlwZU5hbWUoaW5mby5jb21wb25lbnQpfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGluamVjdG9yUHJvbWlzZSA9IG5ldyBQYXJlbnRJbmplY3RvclByb21pc2UoZWxlbWVudCk7XG4gICAgICAgICAgY29uc3QgZmFjYWRlID0gbmV3IERvd25ncmFkZUNvbXBvbmVudEFkYXB0ZXIoXG4gICAgICAgICAgICAgIGVsZW1lbnQsIGF0dHJzLCBzY29wZSwgbmdNb2RlbCwgaW5qZWN0b3IsICRpbmplY3RvciwgJGNvbXBpbGUsICRwYXJzZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50RmFjdG9yeSwgd3JhcENhbGxiYWNrKTtcblxuICAgICAgICAgIGNvbnN0IHByb2plY3RhYmxlTm9kZXMgPSBmYWNhZGUuY29tcGlsZUNvbnRlbnRzKCk7XG4gICAgICAgICAgZmFjYWRlLmNyZWF0ZUNvbXBvbmVudChwcm9qZWN0YWJsZU5vZGVzKTtcbiAgICAgICAgICBmYWNhZGUuc2V0dXBJbnB1dHMoaXNOZ1VwZ3JhZGVMaXRlLCBpbmZvLnByb3BhZ2F0ZURpZ2VzdCk7XG4gICAgICAgICAgZmFjYWRlLnNldHVwT3V0cHV0cygpO1xuICAgICAgICAgIGZhY2FkZS5yZWdpc3RlckNsZWFudXAoKTtcblxuICAgICAgICAgIGluamVjdG9yUHJvbWlzZS5yZXNvbHZlKGZhY2FkZS5nZXRJbmplY3RvcigpKTtcblxuICAgICAgICAgIGlmIChyYW5Bc3luYykge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBydW4gYXN5bmMsIGl0IGlzIHBvc3NpYmxlIHRoYXQgaXQgaXMgbm90IHJ1biBpbnNpZGUgYVxuICAgICAgICAgICAgLy8gZGlnZXN0IGFuZCBpbml0aWFsIGlucHV0IHZhbHVlcyB3aWxsIG5vdCBiZSBkZXRlY3RlZC5cbiAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKCkgPT4ge30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkb3duZ3JhZGVGbiA9XG4gICAgICAgICAgICAhaXNOZ1VwZ3JhZGVMaXRlID8gZG9Eb3duZ3JhZGUgOiAocEluamVjdG9yOiBJbmplY3RvciwgbUluamVjdG9yOiBJbmplY3RvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoIW5nWm9uZSkge1xuICAgICAgICAgICAgICAgIG5nWm9uZSA9IHBJbmplY3Rvci5nZXQoTmdab25lKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHdyYXBDYWxsYmFjaygoKSA9PiBkb0Rvd25ncmFkZShwSW5qZWN0b3IsIG1JbmplY3RvcikpKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8vIE5PVEU6XG4gICAgICAgIC8vIE5vdCB1c2luZyBgUGFyZW50SW5qZWN0b3JQcm9taXNlLmFsbCgpYCAod2hpY2ggaXMgaW5oZXJpdGVkIGZyb20gYFN5bmNQcm9taXNlYCksIGJlY2F1c2VcbiAgICAgICAgLy8gQ2xvc3VyZSBDb21waWxlciAob3Igc29tZSByZWxhdGVkIHRvb2wpIGNvbXBsYWluczpcbiAgICAgICAgLy8gYFR5cGVFcnJvcjogLi4uJHNyYyRkb3duZ3JhZGVfY29tcG9uZW50X1BhcmVudEluamVjdG9yUHJvbWlzZS5hbGwgaXMgbm90IGEgZnVuY3Rpb25gXG4gICAgICAgIFN5bmNQcm9taXNlLmFsbChbZmluYWxQYXJlbnRJbmplY3RvciwgZmluYWxNb2R1bGVJbmplY3Rvcl0pXG4gICAgICAgICAgICAudGhlbigoW3BJbmplY3RvciwgbUluamVjdG9yXSkgPT4gZG93bmdyYWRlRm4ocEluamVjdG9yLCBtSW5qZWN0b3IpKTtcblxuICAgICAgICByYW5Bc3luYyA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBicmFja2V0LW5vdGF0aW9uIGJlY2F1c2Ugb2YgY2xvc3VyZSAtIHNlZSAjMTQ0NDFcbiAgZGlyZWN0aXZlRmFjdG9yeVsnJGluamVjdCddID0gWyRDT01QSUxFLCAkSU5KRUNUT1IsICRQQVJTRV07XG4gIHJldHVybiBkaXJlY3RpdmVGYWN0b3J5O1xufVxuXG4vKipcbiAqIFN5bmNocm9ub3VzIHByb21pc2UtbGlrZSBvYmplY3QgdG8gd3JhcCBwYXJlbnQgaW5qZWN0b3JzLFxuICogdG8gcHJlc2VydmUgdGhlIHN5bmNocm9ub3VzIG5hdHVyZSBvZiBBbmd1bGFySlMncyBgJGNvbXBpbGVgLlxuICovXG5jbGFzcyBQYXJlbnRJbmplY3RvclByb21pc2UgZXh0ZW5kcyBTeW5jUHJvbWlzZTxJbmplY3Rvcj4ge1xuICBwcml2YXRlIGluamVjdG9yS2V5OiBzdHJpbmcgPSBjb250cm9sbGVyS2V5KElOSkVDVE9SX0tFWSk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBJQXVnbWVudGVkSlF1ZXJ5KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIFN0b3JlIHRoZSBwcm9taXNlIG9uIHRoZSBlbGVtZW50LlxuICAgIGVsZW1lbnQuZGF0YSEodGhpcy5pbmplY3RvcktleSwgdGhpcyk7XG4gIH1cblxuICByZXNvbHZlKGluamVjdG9yOiBJbmplY3Rvcik6IHZvaWQge1xuICAgIC8vIFN0b3JlIHRoZSByZWFsIGluamVjdG9yIG9uIHRoZSBlbGVtZW50LlxuICAgIHRoaXMuZWxlbWVudC5kYXRhISh0aGlzLmluamVjdG9yS2V5LCBpbmplY3Rvcik7XG5cbiAgICAvLyBSZWxlYXNlIHRoZSBlbGVtZW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLlxuICAgIHRoaXMuZWxlbWVudCA9IG51bGwhO1xuXG4gICAgLy8gUmVzb2x2ZSB0aGUgcHJvbWlzZS5cbiAgICBzdXBlci5yZXNvbHZlKGluamVjdG9yKTtcbiAgfVxufVxuIl19