/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Injector, NgModule } from '@angular/core';
import * as angular from '../../../src/common/src/angular1';
import { $INJECTOR, INJECTOR_KEY, UPGRADE_APP_TYPE_KEY } from '../../../src/common/src/constants';
var $injector = null;
var injector;
export function $injectorFactory() {
    return $injector;
}
var AngularTestingModule = /** @class */ (function () {
    function AngularTestingModule(i) {
        injector = i;
    }
    AngularTestingModule = __decorate([
        NgModule({ providers: [{ provide: $INJECTOR, useFactory: $injectorFactory }] }),
        __metadata("design:paramtypes", [Injector])
    ], AngularTestingModule);
    return AngularTestingModule;
}());
export { AngularTestingModule };
/**
 * A helper function to use when unit testing Angular services that depend upon upgraded AngularJS
 * services.
 *
 * This function returns an `NgModule` decorated class that is configured to wire up the Angular
 * and AngularJS injectors without the need to actually bootstrap a hybrid application.
 * This makes it simpler and faster to unit test services.
 *
 * Use the returned class as an "import" when configuring the `TestBed`.
 *
 * In the following code snippet, we are configuring the TestBed with two imports.
 * The `Ng2AppModule` is the Angular part of our hybrid application and the `ng1AppModule` is the
 * AngularJS part.
 *
 * <code-example path="upgrade/static/ts/full/module.spec.ts" region="angular-setup"></code-example>
 *
 * Once this is done we can get hold of services via the Angular `Injector` as normal.
 * Services that are (or have dependencies on) an upgraded AngularJS service, will be instantiated
 * as needed by the AngularJS `$injector`.
 *
 * In the following code snippet, `HeroesService` is an Angular service that depends upon an
 * AngularJS service, `titleCase`.
 *
 * <code-example path="upgrade/static/ts/full/module.spec.ts" region="angular-spec"></code-example>
 *
 * <div class="alert is-important">
 *
 * This helper is for testing services not Components.
 * For Component testing you must still bootstrap a hybrid app. See `UpgradeModule` or
 * `downgradeModule` for more information.
 *
 * </div>
 *
 * <div class="alert is-important">
 *
 * The resulting configuration does not wire up AngularJS digests to Zone hooks. It is the
 * responsibility of the test writer to call `$rootScope.$apply`, as necessary, to trigger
 * AngularJS handlers of async events from Angular.
 *
 * </div>
 *
 * <div class="alert is-important">
 *
 * The helper sets up global variables to hold the shared Angular and AngularJS injectors.
 *
 * * Only call this helper once per spec.
 * * Do not use `createAngularTestingModule` in the same spec as `createAngularJSTestingModule`.
 *
 * </div>
 *
 * Here is the example application and its unit tests that use `createAngularTestingModule`
 * and `createAngularJSTestingModule`.
 *
 * <code-tabs>
 *  <code-pane header="module.spec.ts" path="upgrade/static/ts/full/module.spec.ts"></code-pane>
 *  <code-pane header="module.ts" path="upgrade/static/ts/full/module.ts"></code-pane>
 * </code-tabs>
 *
 *
 * @param angularJSModules a collection of the names of AngularJS modules to include in the
 * configuration.
 * @param [strictDi] whether the AngularJS injector should have `strictDI` enabled.
 *
 * @publicApi
 */
export function createAngularTestingModule(angularJSModules, strictDi) {
    angular.module_('$$angularJSTestingModule', angularJSModules)
        .constant(UPGRADE_APP_TYPE_KEY, 2 /* Static */)
        .factory(INJECTOR_KEY, function () { return injector; });
    $injector = angular.injector(['ng', '$$angularJSTestingModule'], strictDi);
    return AngularTestingModule;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX2FuZ3VsYXJfdGVzdGluZ19tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy90ZXN0aW5nL3NyYy9jcmVhdGVfYW5ndWxhcl90ZXN0aW5nX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQU8sTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxrQ0FBa0MsQ0FBQztBQUM1RCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBR2hHLElBQUksU0FBUyxHQUFrQyxJQUFJLENBQUM7QUFDcEQsSUFBSSxRQUFrQixDQUFDO0FBRXZCLE1BQU0sVUFBVSxnQkFBZ0I7SUFDOUIsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUdEO0lBQ0UsOEJBQVksQ0FBVztRQUNyQixRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUhVLG9CQUFvQjtRQURoQyxRQUFRLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFDLENBQUMsRUFBQyxDQUFDO3lDQUUzRCxRQUFRO09BRFosb0JBQW9CLENBSWhDO0lBQUQsMkJBQUM7Q0FBQSxBQUpELElBSUM7U0FKWSxvQkFBb0I7QUFNakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnRUc7QUFDSCxNQUFNLFVBQVUsMEJBQTBCLENBQ3RDLGdCQUEwQixFQUFFLFFBQWtCO0lBQ2hELE9BQU8sQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsZ0JBQWdCLENBQUM7U0FDeEQsUUFBUSxDQUFDLG9CQUFvQixpQkFBd0I7U0FDckQsT0FBTyxDQUFDLFlBQVksRUFBRSxjQUFNLE9BQUEsUUFBUSxFQUFSLENBQVEsQ0FBQyxDQUFDO0lBQzNDLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLDBCQUEwQixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0UsT0FBTyxvQkFBb0IsQ0FBQztBQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdG9yLCBOZ01vZHVsZSwgVHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbW1vbi9zcmMvYW5ndWxhcjEnO1xuaW1wb3J0IHskSU5KRUNUT1IsIElOSkVDVE9SX0tFWSwgVVBHUkFERV9BUFBfVFlQRV9LRVl9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21tb24vc3JjL2NvbnN0YW50cyc7XG5pbXBvcnQge1VwZ3JhZGVBcHBUeXBlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tbW9uL3NyYy91dGlsJztcblxubGV0ICRpbmplY3RvcjogYW5ndWxhci5JSW5qZWN0b3JTZXJ2aWNlfG51bGwgPSBudWxsO1xubGV0IGluamVjdG9yOiBJbmplY3RvcjtcblxuZXhwb3J0IGZ1bmN0aW9uICRpbmplY3RvckZhY3RvcnkoKSB7XG4gIHJldHVybiAkaW5qZWN0b3I7XG59XG5cbkBOZ01vZHVsZSh7cHJvdmlkZXJzOiBbe3Byb3ZpZGU6ICRJTkpFQ1RPUiwgdXNlRmFjdG9yeTogJGluamVjdG9yRmFjdG9yeX1dfSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyVGVzdGluZ01vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKGk6IEluamVjdG9yKSB7XG4gICAgaW5qZWN0b3IgPSBpO1xuICB9XG59XG5cbi8qKlxuICogQSBoZWxwZXIgZnVuY3Rpb24gdG8gdXNlIHdoZW4gdW5pdCB0ZXN0aW5nIEFuZ3VsYXIgc2VydmljZXMgdGhhdCBkZXBlbmQgdXBvbiB1cGdyYWRlZCBBbmd1bGFySlNcbiAqIHNlcnZpY2VzLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhbiBgTmdNb2R1bGVgIGRlY29yYXRlZCBjbGFzcyB0aGF0IGlzIGNvbmZpZ3VyZWQgdG8gd2lyZSB1cCB0aGUgQW5ndWxhclxuICogYW5kIEFuZ3VsYXJKUyBpbmplY3RvcnMgd2l0aG91dCB0aGUgbmVlZCB0byBhY3R1YWxseSBib290c3RyYXAgYSBoeWJyaWQgYXBwbGljYXRpb24uXG4gKiBUaGlzIG1ha2VzIGl0IHNpbXBsZXIgYW5kIGZhc3RlciB0byB1bml0IHRlc3Qgc2VydmljZXMuXG4gKlxuICogVXNlIHRoZSByZXR1cm5lZCBjbGFzcyBhcyBhbiBcImltcG9ydFwiIHdoZW4gY29uZmlndXJpbmcgdGhlIGBUZXN0QmVkYC5cbiAqXG4gKiBJbiB0aGUgZm9sbG93aW5nIGNvZGUgc25pcHBldCwgd2UgYXJlIGNvbmZpZ3VyaW5nIHRoZSBUZXN0QmVkIHdpdGggdHdvIGltcG9ydHMuXG4gKiBUaGUgYE5nMkFwcE1vZHVsZWAgaXMgdGhlIEFuZ3VsYXIgcGFydCBvZiBvdXIgaHlicmlkIGFwcGxpY2F0aW9uIGFuZCB0aGUgYG5nMUFwcE1vZHVsZWAgaXMgdGhlXG4gKiBBbmd1bGFySlMgcGFydC5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJ1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS5zcGVjLnRzXCIgcmVnaW9uPVwiYW5ndWxhci1zZXR1cFwiPjwvY29kZS1leGFtcGxlPlxuICpcbiAqIE9uY2UgdGhpcyBpcyBkb25lIHdlIGNhbiBnZXQgaG9sZCBvZiBzZXJ2aWNlcyB2aWEgdGhlIEFuZ3VsYXIgYEluamVjdG9yYCBhcyBub3JtYWwuXG4gKiBTZXJ2aWNlcyB0aGF0IGFyZSAob3IgaGF2ZSBkZXBlbmRlbmNpZXMgb24pIGFuIHVwZ3JhZGVkIEFuZ3VsYXJKUyBzZXJ2aWNlLCB3aWxsIGJlIGluc3RhbnRpYXRlZFxuICogYXMgbmVlZGVkIGJ5IHRoZSBBbmd1bGFySlMgYCRpbmplY3RvcmAuXG4gKlxuICogSW4gdGhlIGZvbGxvd2luZyBjb2RlIHNuaXBwZXQsIGBIZXJvZXNTZXJ2aWNlYCBpcyBhbiBBbmd1bGFyIHNlcnZpY2UgdGhhdCBkZXBlbmRzIHVwb24gYW5cbiAqIEFuZ3VsYXJKUyBzZXJ2aWNlLCBgdGl0bGVDYXNlYC5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJ1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS5zcGVjLnRzXCIgcmVnaW9uPVwiYW5ndWxhci1zcGVjXCI+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICpcbiAqIFRoaXMgaGVscGVyIGlzIGZvciB0ZXN0aW5nIHNlcnZpY2VzIG5vdCBDb21wb25lbnRzLlxuICogRm9yIENvbXBvbmVudCB0ZXN0aW5nIHlvdSBtdXN0IHN0aWxsIGJvb3RzdHJhcCBhIGh5YnJpZCBhcHAuIFNlZSBgVXBncmFkZU1vZHVsZWAgb3JcbiAqIGBkb3duZ3JhZGVNb2R1bGVgIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIDwvZGl2PlxuICpcbiAqIDxkaXYgY2xhc3M9XCJhbGVydCBpcy1pbXBvcnRhbnRcIj5cbiAqXG4gKiBUaGUgcmVzdWx0aW5nIGNvbmZpZ3VyYXRpb24gZG9lcyBub3Qgd2lyZSB1cCBBbmd1bGFySlMgZGlnZXN0cyB0byBab25lIGhvb2tzLiBJdCBpcyB0aGVcbiAqIHJlc3BvbnNpYmlsaXR5IG9mIHRoZSB0ZXN0IHdyaXRlciB0byBjYWxsIGAkcm9vdFNjb3BlLiRhcHBseWAsIGFzIG5lY2Vzc2FyeSwgdG8gdHJpZ2dlclxuICogQW5ndWxhckpTIGhhbmRsZXJzIG9mIGFzeW5jIGV2ZW50cyBmcm9tIEFuZ3VsYXIuXG4gKlxuICogPC9kaXY+XG4gKlxuICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICpcbiAqIFRoZSBoZWxwZXIgc2V0cyB1cCBnbG9iYWwgdmFyaWFibGVzIHRvIGhvbGQgdGhlIHNoYXJlZCBBbmd1bGFyIGFuZCBBbmd1bGFySlMgaW5qZWN0b3JzLlxuICpcbiAqICogT25seSBjYWxsIHRoaXMgaGVscGVyIG9uY2UgcGVyIHNwZWMuXG4gKiAqIERvIG5vdCB1c2UgYGNyZWF0ZUFuZ3VsYXJUZXN0aW5nTW9kdWxlYCBpbiB0aGUgc2FtZSBzcGVjIGFzIGBjcmVhdGVBbmd1bGFySlNUZXN0aW5nTW9kdWxlYC5cbiAqXG4gKiA8L2Rpdj5cbiAqXG4gKiBIZXJlIGlzIHRoZSBleGFtcGxlIGFwcGxpY2F0aW9uIGFuZCBpdHMgdW5pdCB0ZXN0cyB0aGF0IHVzZSBgY3JlYXRlQW5ndWxhclRlc3RpbmdNb2R1bGVgXG4gKiBhbmQgYGNyZWF0ZUFuZ3VsYXJKU1Rlc3RpbmdNb2R1bGVgLlxuICpcbiAqIDxjb2RlLXRhYnM+XG4gKiAgPGNvZGUtcGFuZSBoZWFkZXI9XCJtb2R1bGUuc3BlYy50c1wiIHBhdGg9XCJ1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS5zcGVjLnRzXCI+PC9jb2RlLXBhbmU+XG4gKiAgPGNvZGUtcGFuZSBoZWFkZXI9XCJtb2R1bGUudHNcIiBwYXRoPVwidXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHNcIj48L2NvZGUtcGFuZT5cbiAqIDwvY29kZS10YWJzPlxuICpcbiAqXG4gKiBAcGFyYW0gYW5ndWxhckpTTW9kdWxlcyBhIGNvbGxlY3Rpb24gb2YgdGhlIG5hbWVzIG9mIEFuZ3VsYXJKUyBtb2R1bGVzIHRvIGluY2x1ZGUgaW4gdGhlXG4gKiBjb25maWd1cmF0aW9uLlxuICogQHBhcmFtIFtzdHJpY3REaV0gd2hldGhlciB0aGUgQW5ndWxhckpTIGluamVjdG9yIHNob3VsZCBoYXZlIGBzdHJpY3RESWAgZW5hYmxlZC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbmd1bGFyVGVzdGluZ01vZHVsZShcbiAgICBhbmd1bGFySlNNb2R1bGVzOiBzdHJpbmdbXSwgc3RyaWN0RGk/OiBib29sZWFuKTogVHlwZTxhbnk+IHtcbiAgYW5ndWxhci5tb2R1bGVfKCckJGFuZ3VsYXJKU1Rlc3RpbmdNb2R1bGUnLCBhbmd1bGFySlNNb2R1bGVzKVxuICAgICAgLmNvbnN0YW50KFVQR1JBREVfQVBQX1RZUEVfS0VZLCBVcGdyYWRlQXBwVHlwZS5TdGF0aWMpXG4gICAgICAuZmFjdG9yeShJTkpFQ1RPUl9LRVksICgpID0+IGluamVjdG9yKTtcbiAgJGluamVjdG9yID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJyQkYW5ndWxhckpTVGVzdGluZ01vZHVsZSddLCBzdHJpY3REaSk7XG4gIHJldHVybiBBbmd1bGFyVGVzdGluZ01vZHVsZTtcbn1cbiJdfQ==