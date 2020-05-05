/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isFunction } from './util';
export function isThenable(obj) {
    return !!obj && isFunction(obj.then);
}
/**
 * Synchronous, promise-like object.
 */
var SyncPromise = /** @class */ (function () {
    function SyncPromise() {
        this.resolved = false;
        this.callbacks = [];
    }
    SyncPromise.all = function (valuesOrPromises) {
        var aggrPromise = new SyncPromise();
        var resolvedCount = 0;
        var results = [];
        var resolve = function (idx, value) {
            results[idx] = value;
            if (++resolvedCount === valuesOrPromises.length)
                aggrPromise.resolve(results);
        };
        valuesOrPromises.forEach(function (p, idx) {
            if (isThenable(p)) {
                p.then(function (v) { return resolve(idx, v); });
            }
            else {
                resolve(idx, p);
            }
        });
        return aggrPromise;
    };
    SyncPromise.prototype.resolve = function (value) {
        // Do nothing, if already resolved.
        if (this.resolved)
            return;
        this.value = value;
        this.resolved = true;
        // Run the queued callbacks.
        this.callbacks.forEach(function (callback) { return callback(value); });
        this.callbacks.length = 0;
    };
    SyncPromise.prototype.then = function (callback) {
        if (this.resolved) {
            callback(this.value);
        }
        else {
            this.callbacks.push(callback);
        }
    };
    return SyncPromise;
}());
export { SyncPromise };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZV91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zcmMvY29tbW9uL3NyYy9wcm9taXNlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQU1sQyxNQUFNLFVBQVUsVUFBVSxDQUFJLEdBQVk7SUFDeEMsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBRSxHQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFBQTtRQUVVLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsY0FBUyxHQUE4QixFQUFFLENBQUM7SUEwQ3BELENBQUM7SUF4Q1EsZUFBRyxHQUFWLFVBQWMsZ0JBQW1DO1FBQy9DLElBQU0sV0FBVyxHQUFHLElBQUksV0FBVyxFQUFPLENBQUM7UUFFM0MsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUN4QixJQUFNLE9BQU8sR0FBRyxVQUFDLEdBQVcsRUFBRSxLQUFRO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxFQUFFLGFBQWEsS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNO2dCQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDO1FBRUYsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFFLEdBQUc7WUFDOUIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDakI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCw2QkFBTyxHQUFQLFVBQVEsS0FBUTtRQUNkLG1DQUFtQztRQUNuQyxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUUxQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVyQiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWYsQ0FBZSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwwQkFBSSxHQUFKLFVBQUssUUFBK0I7UUFDbEMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBTSxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQTdDRCxJQTZDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc0Z1bmN0aW9ufSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRoZW5hYmxlPFQ+IHtcbiAgdGhlbihjYWxsYmFjazogKHZhbHVlOiBUKSA9PiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RoZW5hYmxlPFQ+KG9iajogdW5rbm93bik6IG9iaiBpcyBUaGVuYWJsZTxUPiB7XG4gIHJldHVybiAhIW9iaiAmJiBpc0Z1bmN0aW9uKChvYmogYXMgYW55KS50aGVuKTtcbn1cblxuLyoqXG4gKiBTeW5jaHJvbm91cywgcHJvbWlzZS1saWtlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN5bmNQcm9taXNlPFQ+IHtcbiAgcHJvdGVjdGVkIHZhbHVlOiBUfHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSByZXNvbHZlZCA9IGZhbHNlO1xuICBwcml2YXRlIGNhbGxiYWNrczogKCh2YWx1ZTogVCkgPT4gdW5rbm93bilbXSA9IFtdO1xuXG4gIHN0YXRpYyBhbGw8VD4odmFsdWVzT3JQcm9taXNlczogKFR8VGhlbmFibGU8VD4pW10pOiBTeW5jUHJvbWlzZTxUW10+IHtcbiAgICBjb25zdCBhZ2dyUHJvbWlzZSA9IG5ldyBTeW5jUHJvbWlzZTxUW10+KCk7XG5cbiAgICBsZXQgcmVzb2x2ZWRDb3VudCA9IDA7XG4gICAgY29uc3QgcmVzdWx0czogVFtdID0gW107XG4gICAgY29uc3QgcmVzb2x2ZSA9IChpZHg6IG51bWJlciwgdmFsdWU6IFQpID0+IHtcbiAgICAgIHJlc3VsdHNbaWR4XSA9IHZhbHVlO1xuICAgICAgaWYgKCsrcmVzb2x2ZWRDb3VudCA9PT0gdmFsdWVzT3JQcm9taXNlcy5sZW5ndGgpIGFnZ3JQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfTtcblxuICAgIHZhbHVlc09yUHJvbWlzZXMuZm9yRWFjaCgocCwgaWR4KSA9PiB7XG4gICAgICBpZiAoaXNUaGVuYWJsZShwKSkge1xuICAgICAgICBwLnRoZW4odiA9PiByZXNvbHZlKGlkeCwgdikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShpZHgsIHApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFnZ3JQcm9taXNlO1xuICB9XG5cbiAgcmVzb2x2ZSh2YWx1ZTogVCk6IHZvaWQge1xuICAgIC8vIERvIG5vdGhpbmcsIGlmIGFscmVhZHkgcmVzb2x2ZWQuXG4gICAgaWYgKHRoaXMucmVzb2x2ZWQpIHJldHVybjtcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnJlc29sdmVkID0gdHJ1ZTtcblxuICAgIC8vIFJ1biB0aGUgcXVldWVkIGNhbGxiYWNrcy5cbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHZhbHVlKSk7XG4gICAgdGhpcy5jYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHRoZW4oY2FsbGJhY2s6ICh2YWx1ZTogVCkgPT4gdW5rbm93bik6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlc29sdmVkKSB7XG4gICAgICBjYWxsYmFjayh0aGlzLnZhbHVlISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cbiAgfVxufVxuIl19