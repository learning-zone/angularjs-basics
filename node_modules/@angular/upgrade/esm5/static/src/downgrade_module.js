/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { platformBrowser } from '@angular/platform-browser';
import { module_ as angularModule } from '../../src/common/src/angular1';
import { $INJECTOR, $PROVIDE, DOWNGRADED_MODULE_COUNT_KEY, INJECTOR_KEY, LAZY_MODULE_REF, UPGRADE_APP_TYPE_KEY, UPGRADE_MODULE_NAME } from '../../src/common/src/constants';
import { getDowngradedModuleCount, isFunction } from '../../src/common/src/util';
import { angular1Providers, setTempInjectorRef } from './angular1_providers';
import { NgAdapterInjector } from './util';
var moduleUid = 0;
/**
 * @description
 *
 * A helper function for creating an AngularJS module that can bootstrap an Angular module
 * "on-demand" (possibly lazily) when a {@link downgradeComponent downgraded component} needs to be
 * instantiated.
 *
 * *Part of the [upgrade/static](api?query=upgrade/static) library for hybrid upgrade apps that
 * support AOT compilation.*
 *
 * It allows loading/bootstrapping the Angular part of a hybrid application lazily and not having to
 * pay the cost up-front. For example, you can have an AngularJS application that uses Angular for
 * specific routes and only instantiate the Angular modules if/when the user visits one of these
 * routes.
 *
 * The Angular module will be bootstrapped once (when requested for the first time) and the same
 * reference will be used from that point onwards.
 *
 * `downgradeModule()` requires either an `NgModuleFactory` or a function:
 * - `NgModuleFactory`: If you pass an `NgModuleFactory`, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}.
 * - `Function`: If you pass a function, it is expected to return a promise resolving to an
 *   `NgModuleRef`. The function is called with an array of extra {@link StaticProvider Providers}
 *   that are expected to be available from the returned `NgModuleRef`'s `Injector`.
 *
 * `downgradeModule()` returns the name of the created AngularJS wrapper module. You can use it to
 * declare a dependency in your main AngularJS module.
 *
 * {@example upgrade/static/ts/lite/module.ts region="basic-how-to"}
 *
 * For more details on how to use `downgradeModule()` see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * @usageNotes
 *
 * Apart from `UpgradeModule`, you can use the rest of the `upgrade/static` helpers as usual to
 * build a hybrid application. Note that the Angular pieces (e.g. downgraded services) will not be
 * available until the downgraded module has been bootstrapped, i.e. by instantiating a downgraded
 * component.
 *
 * <div class="alert is-important">
 *
 *   You cannot use `downgradeModule()` and `UpgradeModule` in the same hybrid application.<br />
 *   Use one or the other.
 *
 * </div>
 *
 * ### Differences with `UpgradeModule`
 *
 * Besides their different API, there are two important internal differences between
 * `downgradeModule()` and `UpgradeModule` that affect the behavior of hybrid applications:
 *
 * 1. Unlike `UpgradeModule`, `downgradeModule()` does not bootstrap the main AngularJS module
 *    inside the {@link NgZone Angular zone}.
 * 2. Unlike `UpgradeModule`, `downgradeModule()` does not automatically run a
 *    [$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) when changes are
 *    detected in the Angular part of the application.
 *
 * What this means is that applications using `UpgradeModule` will run change detection more
 * frequently in order to ensure that both frameworks are properly notified about possible changes.
 * This will inevitably result in more change detection runs than necessary.
 *
 * `downgradeModule()`, on the other side, does not try to tie the two change detection systems as
 * tightly, restricting the explicit change detection runs only to cases where it knows it is
 * necessary (e.g. when the inputs of a downgraded component change). This improves performance,
 * especially in change-detection-heavy applications, but leaves it up to the developer to manually
 * notify each framework as needed.
 *
 * For a more detailed discussion of the differences and their implications, see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * <div class="alert is-helpful">
 *
 *   You can manually trigger a change detection run in AngularJS using
 *   [scope.$apply(...)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) or
 *   [$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest).
 *
 *   You can manually trigger a change detection run in Angular using {@link NgZone#run
 *   ngZone.run(...)}.
 *
 * </div>
 *
 * ### Downgrading multiple modules
 *
 * It is possible to downgrade multiple modules and include them in an AngularJS application. In
 * that case, each downgraded module will be bootstrapped when an associated downgraded component or
 * injectable needs to be instantiated.
 *
 * Things to keep in mind, when downgrading multiple modules:
 *
 * - Each downgraded component/injectable needs to be explicitly associated with a downgraded
 *   module. See `downgradeComponent()` and `downgradeInjectable()` for more details.
 *
 * - If you want some injectables to be shared among all downgraded modules, you can provide them as
 *   `StaticProvider`s, when creating the `PlatformRef` (e.g. via `platformBrowser` or
 *   `platformBrowserDynamic`).
 *
 * - When using {@link PlatformRef#bootstrapmodule `bootstrapModule()`} or
 *   {@link PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()`} to bootstrap the
 *   downgraded modules, each one is considered a "root" module. As a consequence, a new instance
 *   will be created for every injectable provided in `"root"` (via
 *   {@link Injectable#providedIn `providedIn`}).
 *   If this is not your intention, you can have a shared module (that will act as act as the "root"
 *   module) and create all downgraded modules using that module's injector:
 *
 *   {@example upgrade/static/ts/lite-multi-shared/module.ts region="shared-root-module"}
 *
 * @publicApi
 */
export function downgradeModule(moduleFactoryOrBootstrapFn) {
    var lazyModuleName = UPGRADE_MODULE_NAME + ".lazy" + ++moduleUid;
    var lazyModuleRefKey = "" + LAZY_MODULE_REF + lazyModuleName;
    var lazyInjectorKey = "" + INJECTOR_KEY + lazyModuleName;
    var bootstrapFn = isFunction(moduleFactoryOrBootstrapFn) ?
        moduleFactoryOrBootstrapFn :
        function (extraProviders) {
            return platformBrowser(extraProviders).bootstrapModuleFactory(moduleFactoryOrBootstrapFn);
        };
    var injector;
    // Create an ng1 module to bootstrap.
    angularModule(lazyModuleName, [])
        .constant(UPGRADE_APP_TYPE_KEY, 3 /* Lite */)
        .factory(INJECTOR_KEY, [lazyInjectorKey, identity])
        .factory(lazyInjectorKey, function () {
        if (!injector) {
            throw new Error('Trying to get the Angular injector before bootstrapping the corresponding ' +
                'Angular module.');
        }
        return injector;
    })
        .factory(LAZY_MODULE_REF, [lazyModuleRefKey, identity])
        .factory(lazyModuleRefKey, [
        $INJECTOR,
        function ($injector) {
            setTempInjectorRef($injector);
            var result = {
                promise: bootstrapFn(angular1Providers).then(function (ref) {
                    injector = result.injector = new NgAdapterInjector(ref.injector);
                    injector.get($INJECTOR);
                    return injector;
                })
            };
            return result;
        }
    ])
        .config([
        $INJECTOR, $PROVIDE,
        function ($injector, $provide) {
            $provide.constant(DOWNGRADED_MODULE_COUNT_KEY, getDowngradedModuleCount($injector) + 1);
        }
    ]);
    return lazyModuleName;
}
function identity(x) {
    return x;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3NyYy9kb3duZ3JhZGVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUUxRCxPQUFPLEVBQW9DLE9BQU8sSUFBSSxhQUFhLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRyxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDMUssT0FBTyxFQUFDLHdCQUF3QixFQUFFLFVBQVUsRUFBZ0MsTUFBTSwyQkFBMkIsQ0FBQztBQUU5RyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFHekMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRWxCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0R0c7QUFDSCxNQUFNLFVBQVUsZUFBZSxDQUFJLDBCQUMrQjtJQUNoRSxJQUFNLGNBQWMsR0FBTSxtQkFBbUIsYUFBUSxFQUFFLFNBQVcsQ0FBQztJQUNuRSxJQUFNLGdCQUFnQixHQUFHLEtBQUcsZUFBZSxHQUFHLGNBQWdCLENBQUM7SUFDL0QsSUFBTSxlQUFlLEdBQUcsS0FBRyxZQUFZLEdBQUcsY0FBZ0IsQ0FBQztJQUUzRCxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1FBQ3hELDBCQUEwQixDQUFDLENBQUM7UUFDNUIsVUFBQyxjQUFnQztZQUM3QixPQUFBLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQywwQkFBMEIsQ0FBQztRQUFsRixDQUFrRixDQUFDO0lBRTNGLElBQUksUUFBa0IsQ0FBQztJQUV2QixxQ0FBcUM7SUFDckMsYUFBYSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUM7U0FDNUIsUUFBUSxDQUFDLG9CQUFvQixlQUFzQjtTQUNuRCxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xELE9BQU8sQ0FDSixlQUFlLEVBQ2Y7UUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FDWCw0RUFBNEU7Z0JBQzVFLGlCQUFpQixDQUFDLENBQUM7U0FDeEI7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDLENBQUM7U0FDTCxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDdEQsT0FBTyxDQUNKLGdCQUFnQixFQUNoQjtRQUNFLFNBQVM7UUFDVCxVQUFDLFNBQTJCO1lBQzFCLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLElBQU0sTUFBTSxHQUFrQjtnQkFDNUIsT0FBTyxFQUFFLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7b0JBQzlDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNqRSxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUV4QixPQUFPLFFBQVEsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDO2FBQ0gsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FDRixDQUFDO1NBQ0wsTUFBTSxDQUFDO1FBQ04sU0FBUyxFQUFFLFFBQVE7UUFDbkIsVUFBQyxTQUEyQixFQUFFLFFBQXlCO1lBQ3JELFFBQVEsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsd0JBQXdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQztLQUNGLENBQUMsQ0FBQztJQUVQLE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBVSxDQUFJO0lBQzdCLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RvciwgTmdNb2R1bGVGYWN0b3J5LCBOZ01vZHVsZVJlZiwgU3RhdGljUHJvdmlkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtwbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQge0lJbmplY3RvclNlcnZpY2UsIElQcm92aWRlU2VydmljZSwgbW9kdWxlXyBhcyBhbmd1bGFyTW9kdWxlfSBmcm9tICcuLi8uLi9zcmMvY29tbW9uL3NyYy9hbmd1bGFyMSc7XG5pbXBvcnQgeyRJTkpFQ1RPUiwgJFBST1ZJREUsIERPV05HUkFERURfTU9EVUxFX0NPVU5UX0tFWSwgSU5KRUNUT1JfS0VZLCBMQVpZX01PRFVMRV9SRUYsIFVQR1JBREVfQVBQX1RZUEVfS0VZLCBVUEdSQURFX01PRFVMRV9OQU1FfSBmcm9tICcuLi8uLi9zcmMvY29tbW9uL3NyYy9jb25zdGFudHMnO1xuaW1wb3J0IHtnZXREb3duZ3JhZGVkTW9kdWxlQ291bnQsIGlzRnVuY3Rpb24sIExhenlNb2R1bGVSZWYsIFVwZ3JhZGVBcHBUeXBlfSBmcm9tICcuLi8uLi9zcmMvY29tbW9uL3NyYy91dGlsJztcblxuaW1wb3J0IHthbmd1bGFyMVByb3ZpZGVycywgc2V0VGVtcEluamVjdG9yUmVmfSBmcm9tICcuL2FuZ3VsYXIxX3Byb3ZpZGVycyc7XG5pbXBvcnQge05nQWRhcHRlckluamVjdG9yfSBmcm9tICcuL3V0aWwnO1xuXG5cbmxldCBtb2R1bGVVaWQgPSAwO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEEgaGVscGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhbiBBbmd1bGFySlMgbW9kdWxlIHRoYXQgY2FuIGJvb3RzdHJhcCBhbiBBbmd1bGFyIG1vZHVsZVxuICogXCJvbi1kZW1hbmRcIiAocG9zc2libHkgbGF6aWx5KSB3aGVuIGEge0BsaW5rIGRvd25ncmFkZUNvbXBvbmVudCBkb3duZ3JhZGVkIGNvbXBvbmVudH0gbmVlZHMgdG8gYmVcbiAqIGluc3RhbnRpYXRlZC5cbiAqXG4gKiAqUGFydCBvZiB0aGUgW3VwZ3JhZGUvc3RhdGljXShhcGk/cXVlcnk9dXBncmFkZS9zdGF0aWMpIGxpYnJhcnkgZm9yIGh5YnJpZCB1cGdyYWRlIGFwcHMgdGhhdFxuICogc3VwcG9ydCBBT1QgY29tcGlsYXRpb24uKlxuICpcbiAqIEl0IGFsbG93cyBsb2FkaW5nL2Jvb3RzdHJhcHBpbmcgdGhlIEFuZ3VsYXIgcGFydCBvZiBhIGh5YnJpZCBhcHBsaWNhdGlvbiBsYXppbHkgYW5kIG5vdCBoYXZpbmcgdG9cbiAqIHBheSB0aGUgY29zdCB1cC1mcm9udC4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gaGF2ZSBhbiBBbmd1bGFySlMgYXBwbGljYXRpb24gdGhhdCB1c2VzIEFuZ3VsYXIgZm9yXG4gKiBzcGVjaWZpYyByb3V0ZXMgYW5kIG9ubHkgaW5zdGFudGlhdGUgdGhlIEFuZ3VsYXIgbW9kdWxlcyBpZi93aGVuIHRoZSB1c2VyIHZpc2l0cyBvbmUgb2YgdGhlc2VcbiAqIHJvdXRlcy5cbiAqXG4gKiBUaGUgQW5ndWxhciBtb2R1bGUgd2lsbCBiZSBib290c3RyYXBwZWQgb25jZSAod2hlbiByZXF1ZXN0ZWQgZm9yIHRoZSBmaXJzdCB0aW1lKSBhbmQgdGhlIHNhbWVcbiAqIHJlZmVyZW5jZSB3aWxsIGJlIHVzZWQgZnJvbSB0aGF0IHBvaW50IG9ud2FyZHMuXG4gKlxuICogYGRvd25ncmFkZU1vZHVsZSgpYCByZXF1aXJlcyBlaXRoZXIgYW4gYE5nTW9kdWxlRmFjdG9yeWAgb3IgYSBmdW5jdGlvbjpcbiAqIC0gYE5nTW9kdWxlRmFjdG9yeWA6IElmIHlvdSBwYXNzIGFuIGBOZ01vZHVsZUZhY3RvcnlgLCBpdCB3aWxsIGJlIHVzZWQgdG8gaW5zdGFudGlhdGUgYSBtb2R1bGVcbiAqICAgdXNpbmcgYHBsYXRmb3JtQnJvd3NlcmAncyB7QGxpbmsgUGxhdGZvcm1SZWYjYm9vdHN0cmFwTW9kdWxlRmFjdG9yeSBib290c3RyYXBNb2R1bGVGYWN0b3J5KCl9LlxuICogLSBgRnVuY3Rpb25gOiBJZiB5b3UgcGFzcyBhIGZ1bmN0aW9uLCBpdCBpcyBleHBlY3RlZCB0byByZXR1cm4gYSBwcm9taXNlIHJlc29sdmluZyB0byBhblxuICogICBgTmdNb2R1bGVSZWZgLiBUaGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYW4gYXJyYXkgb2YgZXh0cmEge0BsaW5rIFN0YXRpY1Byb3ZpZGVyIFByb3ZpZGVyc31cbiAqICAgdGhhdCBhcmUgZXhwZWN0ZWQgdG8gYmUgYXZhaWxhYmxlIGZyb20gdGhlIHJldHVybmVkIGBOZ01vZHVsZVJlZmAncyBgSW5qZWN0b3JgLlxuICpcbiAqIGBkb3duZ3JhZGVNb2R1bGUoKWAgcmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgY3JlYXRlZCBBbmd1bGFySlMgd3JhcHBlciBtb2R1bGUuIFlvdSBjYW4gdXNlIGl0IHRvXG4gKiBkZWNsYXJlIGEgZGVwZW5kZW5jeSBpbiB5b3VyIG1haW4gQW5ndWxhckpTIG1vZHVsZS5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvbGl0ZS9tb2R1bGUudHMgcmVnaW9uPVwiYmFzaWMtaG93LXRvXCJ9XG4gKlxuICogRm9yIG1vcmUgZGV0YWlscyBvbiBob3cgdG8gdXNlIGBkb3duZ3JhZGVNb2R1bGUoKWAgc2VlXG4gKiBbVXBncmFkaW5nIGZvciBQZXJmb3JtYW5jZV0oZ3VpZGUvdXBncmFkZS1wZXJmb3JtYW5jZSkuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBBcGFydCBmcm9tIGBVcGdyYWRlTW9kdWxlYCwgeW91IGNhbiB1c2UgdGhlIHJlc3Qgb2YgdGhlIGB1cGdyYWRlL3N0YXRpY2AgaGVscGVycyBhcyB1c3VhbCB0b1xuICogYnVpbGQgYSBoeWJyaWQgYXBwbGljYXRpb24uIE5vdGUgdGhhdCB0aGUgQW5ndWxhciBwaWVjZXMgKGUuZy4gZG93bmdyYWRlZCBzZXJ2aWNlcykgd2lsbCBub3QgYmVcbiAqIGF2YWlsYWJsZSB1bnRpbCB0aGUgZG93bmdyYWRlZCBtb2R1bGUgaGFzIGJlZW4gYm9vdHN0cmFwcGVkLCBpLmUuIGJ5IGluc3RhbnRpYXRpbmcgYSBkb3duZ3JhZGVkXG4gKiBjb21wb25lbnQuXG4gKlxuICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICpcbiAqICAgWW91IGNhbm5vdCB1c2UgYGRvd25ncmFkZU1vZHVsZSgpYCBhbmQgYFVwZ3JhZGVNb2R1bGVgIGluIHRoZSBzYW1lIGh5YnJpZCBhcHBsaWNhdGlvbi48YnIgLz5cbiAqICAgVXNlIG9uZSBvciB0aGUgb3RoZXIuXG4gKlxuICogPC9kaXY+XG4gKlxuICogIyMjIERpZmZlcmVuY2VzIHdpdGggYFVwZ3JhZGVNb2R1bGVgXG4gKlxuICogQmVzaWRlcyB0aGVpciBkaWZmZXJlbnQgQVBJLCB0aGVyZSBhcmUgdHdvIGltcG9ydGFudCBpbnRlcm5hbCBkaWZmZXJlbmNlcyBiZXR3ZWVuXG4gKiBgZG93bmdyYWRlTW9kdWxlKClgIGFuZCBgVXBncmFkZU1vZHVsZWAgdGhhdCBhZmZlY3QgdGhlIGJlaGF2aW9yIG9mIGh5YnJpZCBhcHBsaWNhdGlvbnM6XG4gKlxuICogMS4gVW5saWtlIGBVcGdyYWRlTW9kdWxlYCwgYGRvd25ncmFkZU1vZHVsZSgpYCBkb2VzIG5vdCBib290c3RyYXAgdGhlIG1haW4gQW5ndWxhckpTIG1vZHVsZVxuICogICAgaW5zaWRlIHRoZSB7QGxpbmsgTmdab25lIEFuZ3VsYXIgem9uZX0uXG4gKiAyLiBVbmxpa2UgYFVwZ3JhZGVNb2R1bGVgLCBgZG93bmdyYWRlTW9kdWxlKClgIGRvZXMgbm90IGF1dG9tYXRpY2FsbHkgcnVuIGFcbiAqICAgIFskZGlnZXN0KCldKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy90eXBlLyRyb290U2NvcGUuU2NvcGUjJGRpZ2VzdCkgd2hlbiBjaGFuZ2VzIGFyZVxuICogICAgZGV0ZWN0ZWQgaW4gdGhlIEFuZ3VsYXIgcGFydCBvZiB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogV2hhdCB0aGlzIG1lYW5zIGlzIHRoYXQgYXBwbGljYXRpb25zIHVzaW5nIGBVcGdyYWRlTW9kdWxlYCB3aWxsIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG1vcmVcbiAqIGZyZXF1ZW50bHkgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgYm90aCBmcmFtZXdvcmtzIGFyZSBwcm9wZXJseSBub3RpZmllZCBhYm91dCBwb3NzaWJsZSBjaGFuZ2VzLlxuICogVGhpcyB3aWxsIGluZXZpdGFibHkgcmVzdWx0IGluIG1vcmUgY2hhbmdlIGRldGVjdGlvbiBydW5zIHRoYW4gbmVjZXNzYXJ5LlxuICpcbiAqIGBkb3duZ3JhZGVNb2R1bGUoKWAsIG9uIHRoZSBvdGhlciBzaWRlLCBkb2VzIG5vdCB0cnkgdG8gdGllIHRoZSB0d28gY2hhbmdlIGRldGVjdGlvbiBzeXN0ZW1zIGFzXG4gKiB0aWdodGx5LCByZXN0cmljdGluZyB0aGUgZXhwbGljaXQgY2hhbmdlIGRldGVjdGlvbiBydW5zIG9ubHkgdG8gY2FzZXMgd2hlcmUgaXQga25vd3MgaXQgaXNcbiAqIG5lY2Vzc2FyeSAoZS5nLiB3aGVuIHRoZSBpbnB1dHMgb2YgYSBkb3duZ3JhZGVkIGNvbXBvbmVudCBjaGFuZ2UpLiBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlLFxuICogZXNwZWNpYWxseSBpbiBjaGFuZ2UtZGV0ZWN0aW9uLWhlYXZ5IGFwcGxpY2F0aW9ucywgYnV0IGxlYXZlcyBpdCB1cCB0byB0aGUgZGV2ZWxvcGVyIHRvIG1hbnVhbGx5XG4gKiBub3RpZnkgZWFjaCBmcmFtZXdvcmsgYXMgbmVlZGVkLlxuICpcbiAqIEZvciBhIG1vcmUgZGV0YWlsZWQgZGlzY3Vzc2lvbiBvZiB0aGUgZGlmZmVyZW5jZXMgYW5kIHRoZWlyIGltcGxpY2F0aW9ucywgc2VlXG4gKiBbVXBncmFkaW5nIGZvciBQZXJmb3JtYW5jZV0oZ3VpZGUvdXBncmFkZS1wZXJmb3JtYW5jZSkuXG4gKlxuICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWhlbHBmdWxcIj5cbiAqXG4gKiAgIFlvdSBjYW4gbWFudWFsbHkgdHJpZ2dlciBhIGNoYW5nZSBkZXRlY3Rpb24gcnVuIGluIEFuZ3VsYXJKUyB1c2luZ1xuICogICBbc2NvcGUuJGFwcGx5KC4uLildKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy90eXBlLyRyb290U2NvcGUuU2NvcGUjJGFwcGx5KSBvclxuICogICBbJHJvb3RTY29wZS4kZGlnZXN0KCldKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy90eXBlLyRyb290U2NvcGUuU2NvcGUjJGRpZ2VzdCkuXG4gKlxuICogICBZb3UgY2FuIG1hbnVhbGx5IHRyaWdnZXIgYSBjaGFuZ2UgZGV0ZWN0aW9uIHJ1biBpbiBBbmd1bGFyIHVzaW5nIHtAbGluayBOZ1pvbmUjcnVuXG4gKiAgIG5nWm9uZS5ydW4oLi4uKX0uXG4gKlxuICogPC9kaXY+XG4gKlxuICogIyMjIERvd25ncmFkaW5nIG11bHRpcGxlIG1vZHVsZXNcbiAqXG4gKiBJdCBpcyBwb3NzaWJsZSB0byBkb3duZ3JhZGUgbXVsdGlwbGUgbW9kdWxlcyBhbmQgaW5jbHVkZSB0aGVtIGluIGFuIEFuZ3VsYXJKUyBhcHBsaWNhdGlvbi4gSW5cbiAqIHRoYXQgY2FzZSwgZWFjaCBkb3duZ3JhZGVkIG1vZHVsZSB3aWxsIGJlIGJvb3RzdHJhcHBlZCB3aGVuIGFuIGFzc29jaWF0ZWQgZG93bmdyYWRlZCBjb21wb25lbnQgb3JcbiAqIGluamVjdGFibGUgbmVlZHMgdG8gYmUgaW5zdGFudGlhdGVkLlxuICpcbiAqIFRoaW5ncyB0byBrZWVwIGluIG1pbmQsIHdoZW4gZG93bmdyYWRpbmcgbXVsdGlwbGUgbW9kdWxlczpcbiAqXG4gKiAtIEVhY2ggZG93bmdyYWRlZCBjb21wb25lbnQvaW5qZWN0YWJsZSBuZWVkcyB0byBiZSBleHBsaWNpdGx5IGFzc29jaWF0ZWQgd2l0aCBhIGRvd25ncmFkZWRcbiAqICAgbW9kdWxlLiBTZWUgYGRvd25ncmFkZUNvbXBvbmVudCgpYCBhbmQgYGRvd25ncmFkZUluamVjdGFibGUoKWAgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAtIElmIHlvdSB3YW50IHNvbWUgaW5qZWN0YWJsZXMgdG8gYmUgc2hhcmVkIGFtb25nIGFsbCBkb3duZ3JhZGVkIG1vZHVsZXMsIHlvdSBjYW4gcHJvdmlkZSB0aGVtIGFzXG4gKiAgIGBTdGF0aWNQcm92aWRlcmBzLCB3aGVuIGNyZWF0aW5nIHRoZSBgUGxhdGZvcm1SZWZgIChlLmcuIHZpYSBgcGxhdGZvcm1Ccm93c2VyYCBvclxuICogICBgcGxhdGZvcm1Ccm93c2VyRHluYW1pY2ApLlxuICpcbiAqIC0gV2hlbiB1c2luZyB7QGxpbmsgUGxhdGZvcm1SZWYjYm9vdHN0cmFwbW9kdWxlIGBib290c3RyYXBNb2R1bGUoKWB9IG9yXG4gKiAgIHtAbGluayBQbGF0Zm9ybVJlZiNib290c3RyYXBtb2R1bGVmYWN0b3J5IGBib290c3RyYXBNb2R1bGVGYWN0b3J5KClgfSB0byBib290c3RyYXAgdGhlXG4gKiAgIGRvd25ncmFkZWQgbW9kdWxlcywgZWFjaCBvbmUgaXMgY29uc2lkZXJlZCBhIFwicm9vdFwiIG1vZHVsZS4gQXMgYSBjb25zZXF1ZW5jZSwgYSBuZXcgaW5zdGFuY2VcbiAqICAgd2lsbCBiZSBjcmVhdGVkIGZvciBldmVyeSBpbmplY3RhYmxlIHByb3ZpZGVkIGluIGBcInJvb3RcImAgKHZpYVxuICogICB7QGxpbmsgSW5qZWN0YWJsZSNwcm92aWRlZEluIGBwcm92aWRlZEluYH0pLlxuICogICBJZiB0aGlzIGlzIG5vdCB5b3VyIGludGVudGlvbiwgeW91IGNhbiBoYXZlIGEgc2hhcmVkIG1vZHVsZSAodGhhdCB3aWxsIGFjdCBhcyBhY3QgYXMgdGhlIFwicm9vdFwiXG4gKiAgIG1vZHVsZSkgYW5kIGNyZWF0ZSBhbGwgZG93bmdyYWRlZCBtb2R1bGVzIHVzaW5nIHRoYXQgbW9kdWxlJ3MgaW5qZWN0b3I6XG4gKlxuICogICB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvbGl0ZS1tdWx0aS1zaGFyZWQvbW9kdWxlLnRzIHJlZ2lvbj1cInNoYXJlZC1yb290LW1vZHVsZVwifVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvd25ncmFkZU1vZHVsZTxUPihtb2R1bGVGYWN0b3J5T3JCb290c3RyYXBGbjogTmdNb2R1bGVGYWN0b3J5PFQ+fChcbiAgICAoZXh0cmFQcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10pID0+IFByb21pc2U8TmdNb2R1bGVSZWY8VD4+KSk6IHN0cmluZyB7XG4gIGNvbnN0IGxhenlNb2R1bGVOYW1lID0gYCR7VVBHUkFERV9NT0RVTEVfTkFNRX0ubGF6eSR7Kyttb2R1bGVVaWR9YDtcbiAgY29uc3QgbGF6eU1vZHVsZVJlZktleSA9IGAke0xBWllfTU9EVUxFX1JFRn0ke2xhenlNb2R1bGVOYW1lfWA7XG4gIGNvbnN0IGxhenlJbmplY3RvcktleSA9IGAke0lOSkVDVE9SX0tFWX0ke2xhenlNb2R1bGVOYW1lfWA7XG5cbiAgY29uc3QgYm9vdHN0cmFwRm4gPSBpc0Z1bmN0aW9uKG1vZHVsZUZhY3RvcnlPckJvb3RzdHJhcEZuKSA/XG4gICAgICBtb2R1bGVGYWN0b3J5T3JCb290c3RyYXBGbiA6XG4gICAgICAoZXh0cmFQcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10pID0+XG4gICAgICAgICAgcGxhdGZvcm1Ccm93c2VyKGV4dHJhUHJvdmlkZXJzKS5ib290c3RyYXBNb2R1bGVGYWN0b3J5KG1vZHVsZUZhY3RvcnlPckJvb3RzdHJhcEZuKTtcblxuICBsZXQgaW5qZWN0b3I6IEluamVjdG9yO1xuXG4gIC8vIENyZWF0ZSBhbiBuZzEgbW9kdWxlIHRvIGJvb3RzdHJhcC5cbiAgYW5ndWxhck1vZHVsZShsYXp5TW9kdWxlTmFtZSwgW10pXG4gICAgICAuY29uc3RhbnQoVVBHUkFERV9BUFBfVFlQRV9LRVksIFVwZ3JhZGVBcHBUeXBlLkxpdGUpXG4gICAgICAuZmFjdG9yeShJTkpFQ1RPUl9LRVksIFtsYXp5SW5qZWN0b3JLZXksIGlkZW50aXR5XSlcbiAgICAgIC5mYWN0b3J5KFxuICAgICAgICAgIGxhenlJbmplY3RvcktleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWluamVjdG9yKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICdUcnlpbmcgdG8gZ2V0IHRoZSBBbmd1bGFyIGluamVjdG9yIGJlZm9yZSBib290c3RyYXBwaW5nIHRoZSBjb3JyZXNwb25kaW5nICcgK1xuICAgICAgICAgICAgICAgICAgJ0FuZ3VsYXIgbW9kdWxlLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yO1xuICAgICAgICAgIH0pXG4gICAgICAuZmFjdG9yeShMQVpZX01PRFVMRV9SRUYsIFtsYXp5TW9kdWxlUmVmS2V5LCBpZGVudGl0eV0pXG4gICAgICAuZmFjdG9yeShcbiAgICAgICAgICBsYXp5TW9kdWxlUmVmS2V5LFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICRJTkpFQ1RPUixcbiAgICAgICAgICAgICgkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UpID0+IHtcbiAgICAgICAgICAgICAgc2V0VGVtcEluamVjdG9yUmVmKCRpbmplY3Rvcik7XG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogTGF6eU1vZHVsZVJlZiA9IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlOiBib290c3RyYXBGbihhbmd1bGFyMVByb3ZpZGVycykudGhlbihyZWYgPT4ge1xuICAgICAgICAgICAgICAgICAgaW5qZWN0b3IgPSByZXN1bHQuaW5qZWN0b3IgPSBuZXcgTmdBZGFwdGVySW5qZWN0b3IocmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgICAgICAgIGluamVjdG9yLmdldCgkSU5KRUNUT1IpO1xuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gaW5qZWN0b3I7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdKVxuICAgICAgLmNvbmZpZyhbXG4gICAgICAgICRJTkpFQ1RPUiwgJFBST1ZJREUsXG4gICAgICAgICgkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UsICRwcm92aWRlOiBJUHJvdmlkZVNlcnZpY2UpID0+IHtcbiAgICAgICAgICAkcHJvdmlkZS5jb25zdGFudChET1dOR1JBREVEX01PRFVMRV9DT1VOVF9LRVksIGdldERvd25ncmFkZWRNb2R1bGVDb3VudCgkaW5qZWN0b3IpICsgMSk7XG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gIHJldHVybiBsYXp5TW9kdWxlTmFtZTtcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHk8VCA9IGFueT4oeDogVCk6IFQge1xuICByZXR1cm4geDtcbn1cbiJdfQ==