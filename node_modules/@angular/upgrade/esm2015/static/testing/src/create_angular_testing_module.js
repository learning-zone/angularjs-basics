/**
 * @fileoverview added by tsickle
 * Generated from: packages/upgrade/static/testing/src/create_angular_testing_module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector, NgModule } from '@angular/core';
import * as angular from '../../../src/common/src/angular1';
import { $INJECTOR, INJECTOR_KEY, UPGRADE_APP_TYPE_KEY } from '../../../src/common/src/constants';
/** @type {?} */
let $injector = null;
/** @type {?} */
let injector;
/**
 * @return {?}
 */
export function $injectorFactory() {
    return $injector;
}
export class AngularTestingModule {
    /**
     * @param {?} i
     */
    constructor(i) {
        injector = i;
    }
}
AngularTestingModule.decorators = [
    { type: NgModule, args: [{ providers: [{ provide: $INJECTOR, useFactory: $injectorFactory }] },] }
];
/** @nocollapse */
AngularTestingModule.ctorParameters = () => [
    { type: Injector }
];
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
 * \@publicApi
 * @param {?} angularJSModules a collection of the names of AngularJS modules to include in the
 * configuration.
 * @param {?=} strictDi
 * @return {?}
 */
export function createAngularTestingModule(angularJSModules, strictDi) {
    angular.module_('$$angularJSTestingModule', angularJSModules)
        .constant(UPGRADE_APP_TYPE_KEY, 2 /* Static */)
        .factory(INJECTOR_KEY, (/**
     * @return {?}
     */
    () => injector));
    $injector = angular.injector(['ng', '$$angularJSTestingModule'], strictDi);
    return AngularTestingModule;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX2FuZ3VsYXJfdGVzdGluZ19tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy90ZXN0aW5nL3NyYy9jcmVhdGVfYW5ndWxhcl90ZXN0aW5nX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBTyxNQUFNLGVBQWUsQ0FBQztBQUV2RCxPQUFPLEtBQUssT0FBTyxNQUFNLGtDQUFrQyxDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7O0lBRzVGLFNBQVMsR0FBa0MsSUFBSTs7SUFDL0MsUUFBa0I7Ozs7QUFFdEIsTUFBTSxVQUFVLGdCQUFnQjtJQUM5QixPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBR0QsTUFBTSxPQUFPLG9CQUFvQjs7OztJQUMvQixZQUFZLENBQVc7UUFDckIsUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7OztZQUpGLFFBQVEsU0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxFQUFDOzs7O1lBYm5FLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxRmhCLE1BQU0sVUFBVSwwQkFBMEIsQ0FDdEMsZ0JBQTBCLEVBQUUsUUFBa0I7SUFDaEQsT0FBTyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxnQkFBZ0IsQ0FBQztTQUN4RCxRQUFRLENBQUMsb0JBQW9CLGlCQUF3QjtTQUNyRCxPQUFPLENBQUMsWUFBWTs7O0lBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFDLENBQUM7SUFDM0MsU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsMEJBQTBCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzRSxPQUFPLG9CQUFvQixDQUFDO0FBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0b3IsIE5nTW9kdWxlLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICcuLi8uLi8uLi9zcmMvY29tbW9uL3NyYy9hbmd1bGFyMSc7XG5pbXBvcnQgeyRJTkpFQ1RPUiwgSU5KRUNUT1JfS0VZLCBVUEdSQURFX0FQUF9UWVBFX0tFWX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbW1vbi9zcmMvY29uc3RhbnRzJztcbmltcG9ydCB7VXBncmFkZUFwcFR5cGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21tb24vc3JjL3V0aWwnO1xuXG5sZXQgJGluamVjdG9yOiBhbmd1bGFyLklJbmplY3RvclNlcnZpY2V8bnVsbCA9IG51bGw7XG5sZXQgaW5qZWN0b3I6IEluamVjdG9yO1xuXG5leHBvcnQgZnVuY3Rpb24gJGluamVjdG9yRmFjdG9yeSgpIHtcbiAgcmV0dXJuICRpbmplY3Rvcjtcbn1cblxuQE5nTW9kdWxlKHtwcm92aWRlcnM6IFt7cHJvdmlkZTogJElOSkVDVE9SLCB1c2VGYWN0b3J5OiAkaW5qZWN0b3JGYWN0b3J5fV19KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJUZXN0aW5nTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoaTogSW5qZWN0b3IpIHtcbiAgICBpbmplY3RvciA9IGk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB0byB1c2Ugd2hlbiB1bml0IHRlc3RpbmcgQW5ndWxhciBzZXJ2aWNlcyB0aGF0IGRlcGVuZCB1cG9uIHVwZ3JhZGVkIEFuZ3VsYXJKU1xuICogc2VydmljZXMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGFuIGBOZ01vZHVsZWAgZGVjb3JhdGVkIGNsYXNzIHRoYXQgaXMgY29uZmlndXJlZCB0byB3aXJlIHVwIHRoZSBBbmd1bGFyXG4gKiBhbmQgQW5ndWxhckpTIGluamVjdG9ycyB3aXRob3V0IHRoZSBuZWVkIHRvIGFjdHVhbGx5IGJvb3RzdHJhcCBhIGh5YnJpZCBhcHBsaWNhdGlvbi5cbiAqIFRoaXMgbWFrZXMgaXQgc2ltcGxlciBhbmQgZmFzdGVyIHRvIHVuaXQgdGVzdCBzZXJ2aWNlcy5cbiAqXG4gKiBVc2UgdGhlIHJldHVybmVkIGNsYXNzIGFzIGFuIFwiaW1wb3J0XCIgd2hlbiBjb25maWd1cmluZyB0aGUgYFRlc3RCZWRgLlxuICpcbiAqIEluIHRoZSBmb2xsb3dpbmcgY29kZSBzbmlwcGV0LCB3ZSBhcmUgY29uZmlndXJpbmcgdGhlIFRlc3RCZWQgd2l0aCB0d28gaW1wb3J0cy5cbiAqIFRoZSBgTmcyQXBwTW9kdWxlYCBpcyB0aGUgQW5ndWxhciBwYXJ0IG9mIG91ciBoeWJyaWQgYXBwbGljYXRpb24gYW5kIHRoZSBgbmcxQXBwTW9kdWxlYCBpcyB0aGVcbiAqIEFuZ3VsYXJKUyBwYXJ0LlxuICpcbiAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cInVwZ3JhZGUvc3RhdGljL3RzL2Z1bGwvbW9kdWxlLnNwZWMudHNcIiByZWdpb249XCJhbmd1bGFyLXNldHVwXCI+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogT25jZSB0aGlzIGlzIGRvbmUgd2UgY2FuIGdldCBob2xkIG9mIHNlcnZpY2VzIHZpYSB0aGUgQW5ndWxhciBgSW5qZWN0b3JgIGFzIG5vcm1hbC5cbiAqIFNlcnZpY2VzIHRoYXQgYXJlIChvciBoYXZlIGRlcGVuZGVuY2llcyBvbikgYW4gdXBncmFkZWQgQW5ndWxhckpTIHNlcnZpY2UsIHdpbGwgYmUgaW5zdGFudGlhdGVkXG4gKiBhcyBuZWVkZWQgYnkgdGhlIEFuZ3VsYXJKUyBgJGluamVjdG9yYC5cbiAqXG4gKiBJbiB0aGUgZm9sbG93aW5nIGNvZGUgc25pcHBldCwgYEhlcm9lc1NlcnZpY2VgIGlzIGFuIEFuZ3VsYXIgc2VydmljZSB0aGF0IGRlcGVuZHMgdXBvbiBhblxuICogQW5ndWxhckpTIHNlcnZpY2UsIGB0aXRsZUNhc2VgLlxuICpcbiAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cInVwZ3JhZGUvc3RhdGljL3RzL2Z1bGwvbW9kdWxlLnNwZWMudHNcIiByZWdpb249XCJhbmd1bGFyLXNwZWNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiA8ZGl2IGNsYXNzPVwiYWxlcnQgaXMtaW1wb3J0YW50XCI+XG4gKlxuICogVGhpcyBoZWxwZXIgaXMgZm9yIHRlc3Rpbmcgc2VydmljZXMgbm90IENvbXBvbmVudHMuXG4gKiBGb3IgQ29tcG9uZW50IHRlc3RpbmcgeW91IG11c3Qgc3RpbGwgYm9vdHN0cmFwIGEgaHlicmlkIGFwcC4gU2VlIGBVcGdyYWRlTW9kdWxlYCBvclxuICogYGRvd25ncmFkZU1vZHVsZWAgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogPC9kaXY+XG4gKlxuICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICpcbiAqIFRoZSByZXN1bHRpbmcgY29uZmlndXJhdGlvbiBkb2VzIG5vdCB3aXJlIHVwIEFuZ3VsYXJKUyBkaWdlc3RzIHRvIFpvbmUgaG9va3MuIEl0IGlzIHRoZVxuICogcmVzcG9uc2liaWxpdHkgb2YgdGhlIHRlc3Qgd3JpdGVyIHRvIGNhbGwgYCRyb290U2NvcGUuJGFwcGx5YCwgYXMgbmVjZXNzYXJ5LCB0byB0cmlnZ2VyXG4gKiBBbmd1bGFySlMgaGFuZGxlcnMgb2YgYXN5bmMgZXZlbnRzIGZyb20gQW5ndWxhci5cbiAqXG4gKiA8L2Rpdj5cbiAqXG4gKiA8ZGl2IGNsYXNzPVwiYWxlcnQgaXMtaW1wb3J0YW50XCI+XG4gKlxuICogVGhlIGhlbHBlciBzZXRzIHVwIGdsb2JhbCB2YXJpYWJsZXMgdG8gaG9sZCB0aGUgc2hhcmVkIEFuZ3VsYXIgYW5kIEFuZ3VsYXJKUyBpbmplY3RvcnMuXG4gKlxuICogKiBPbmx5IGNhbGwgdGhpcyBoZWxwZXIgb25jZSBwZXIgc3BlYy5cbiAqICogRG8gbm90IHVzZSBgY3JlYXRlQW5ndWxhclRlc3RpbmdNb2R1bGVgIGluIHRoZSBzYW1lIHNwZWMgYXMgYGNyZWF0ZUFuZ3VsYXJKU1Rlc3RpbmdNb2R1bGVgLlxuICpcbiAqIDwvZGl2PlxuICpcbiAqIEhlcmUgaXMgdGhlIGV4YW1wbGUgYXBwbGljYXRpb24gYW5kIGl0cyB1bml0IHRlc3RzIHRoYXQgdXNlIGBjcmVhdGVBbmd1bGFyVGVzdGluZ01vZHVsZWBcbiAqIGFuZCBgY3JlYXRlQW5ndWxhckpTVGVzdGluZ01vZHVsZWAuXG4gKlxuICogPGNvZGUtdGFicz5cbiAqICA8Y29kZS1wYW5lIGhlYWRlcj1cIm1vZHVsZS5zcGVjLnRzXCIgcGF0aD1cInVwZ3JhZGUvc3RhdGljL3RzL2Z1bGwvbW9kdWxlLnNwZWMudHNcIj48L2NvZGUtcGFuZT5cbiAqICA8Y29kZS1wYW5lIGhlYWRlcj1cIm1vZHVsZS50c1wiIHBhdGg9XCJ1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS50c1wiPjwvY29kZS1wYW5lPlxuICogPC9jb2RlLXRhYnM+XG4gKlxuICpcbiAqIEBwYXJhbSBhbmd1bGFySlNNb2R1bGVzIGEgY29sbGVjdGlvbiBvZiB0aGUgbmFtZXMgb2YgQW5ndWxhckpTIG1vZHVsZXMgdG8gaW5jbHVkZSBpbiB0aGVcbiAqIGNvbmZpZ3VyYXRpb24uXG4gKiBAcGFyYW0gW3N0cmljdERpXSB3aGV0aGVyIHRoZSBBbmd1bGFySlMgaW5qZWN0b3Igc2hvdWxkIGhhdmUgYHN0cmljdERJYCBlbmFibGVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFuZ3VsYXJUZXN0aW5nTW9kdWxlKFxuICAgIGFuZ3VsYXJKU01vZHVsZXM6IHN0cmluZ1tdLCBzdHJpY3REaT86IGJvb2xlYW4pOiBUeXBlPGFueT4ge1xuICBhbmd1bGFyLm1vZHVsZV8oJyQkYW5ndWxhckpTVGVzdGluZ01vZHVsZScsIGFuZ3VsYXJKU01vZHVsZXMpXG4gICAgICAuY29uc3RhbnQoVVBHUkFERV9BUFBfVFlQRV9LRVksIFVwZ3JhZGVBcHBUeXBlLlN0YXRpYylcbiAgICAgIC5mYWN0b3J5KElOSkVDVE9SX0tFWSwgKCkgPT4gaW5qZWN0b3IpO1xuICAkaW5qZWN0b3IgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAnJCRhbmd1bGFySlNUZXN0aW5nTW9kdWxlJ10sIHN0cmljdERpKTtcbiAgcmV0dXJuIEFuZ3VsYXJUZXN0aW5nTW9kdWxlO1xufVxuIl19