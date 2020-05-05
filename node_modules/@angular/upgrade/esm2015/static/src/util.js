/**
 * @fileoverview added by tsickle
 * Generated from: packages/upgrade/static/src/util.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR as NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
export class NgAdapterInjector {
    /**
     * @param {?} modInjector
     */
    constructor(modInjector) {
        this.modInjector = modInjector;
    }
    // When Angular locate a service in the component injector tree, the not found value is set to
    // `NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR`. In such a case we should not walk up to the module
    // injector.
    // AngularJS only supports a single tree and should always check the module injector.
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    get(token, notFoundValue) {
        if (notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
            return notFoundValue;
        }
        return this.modInjector.get(token, notFoundValue);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgAdapterInjector.prototype.modInjector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBVyxzQ0FBc0MsSUFBSSxxQ0FBcUMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUd4SCxNQUFNLE9BQU8saUJBQWlCOzs7O0lBQzVCLFlBQW9CLFdBQXFCO1FBQXJCLGdCQUFXLEdBQVgsV0FBVyxDQUFVO0lBQUcsQ0FBQzs7Ozs7Ozs7OztJQU03QyxHQUFHLENBQUMsS0FBVSxFQUFFLGFBQW1CO1FBQ2pDLElBQUksYUFBYSxLQUFLLHFDQUFxQyxFQUFFO1lBQzNELE9BQU8sYUFBYSxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGOzs7Ozs7SUFiYSx3Q0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0b3IsIMm1Tk9UX0ZPVU5EX0NIRUNLX09OTFlfRUxFTUVOVF9JTkpFQ1RPUiBhcyBOT1RfRk9VTkRfQ0hFQ0tfT05MWV9FTEVNRU5UX0lOSkVDVE9SfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG5leHBvcnQgY2xhc3MgTmdBZGFwdGVySW5qZWN0b3IgaW1wbGVtZW50cyBJbmplY3RvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbW9kSW5qZWN0b3I6IEluamVjdG9yKSB7fVxuXG4gIC8vIFdoZW4gQW5ndWxhciBsb2NhdGUgYSBzZXJ2aWNlIGluIHRoZSBjb21wb25lbnQgaW5qZWN0b3IgdHJlZSwgdGhlIG5vdCBmb3VuZCB2YWx1ZSBpcyBzZXQgdG9cbiAgLy8gYE5PVF9GT1VORF9DSEVDS19PTkxZX0VMRU1FTlRfSU5KRUNUT1JgLiBJbiBzdWNoIGEgY2FzZSB3ZSBzaG91bGQgbm90IHdhbGsgdXAgdG8gdGhlIG1vZHVsZVxuICAvLyBpbmplY3Rvci5cbiAgLy8gQW5ndWxhckpTIG9ubHkgc3VwcG9ydHMgYSBzaW5nbGUgdHJlZSBhbmQgc2hvdWxkIGFsd2F5cyBjaGVjayB0aGUgbW9kdWxlIGluamVjdG9yLlxuICBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZT86IGFueSk6IGFueSB7XG4gICAgaWYgKG5vdEZvdW5kVmFsdWUgPT09IE5PVF9GT1VORF9DSEVDS19PTkxZX0VMRU1FTlRfSU5KRUNUT1IpIHtcbiAgICAgIHJldHVybiBub3RGb3VuZFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1vZEluamVjdG9yLmdldCh0b2tlbiwgbm90Rm91bmRWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==