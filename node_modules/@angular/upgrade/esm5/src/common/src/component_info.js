/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A `PropertyBinding` represents a mapping between a property name
 * and an attribute name. It is parsed from a string of the form
 * `"prop: attr"`; or simply `"propAndAttr" where the property
 * and attribute have the same identifier.
 */
var PropertyBinding = /** @class */ (function () {
    function PropertyBinding(prop, attr) {
        this.prop = prop;
        this.attr = attr;
        this.parseBinding();
    }
    PropertyBinding.prototype.parseBinding = function () {
        this.bracketAttr = "[" + this.attr + "]";
        this.parenAttr = "(" + this.attr + ")";
        this.bracketParenAttr = "[(" + this.attr + ")]";
        var capitalAttr = this.attr.charAt(0).toUpperCase() + this.attr.substr(1);
        this.onAttr = "on" + capitalAttr;
        this.bindAttr = "bind" + capitalAttr;
        this.bindonAttr = "bindon" + capitalAttr;
    };
    return PropertyBinding;
}());
export { PropertyBinding };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2luZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9jb21tb24vc3JjL2NvbXBvbmVudF9pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7OztHQUtHO0FBQ0g7SUFjRSx5QkFBbUIsSUFBWSxFQUFTLElBQVk7UUFBakMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFDbEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTyxzQ0FBWSxHQUFwQjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBSSxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFJLElBQUksQ0FBQyxJQUFJLE1BQUcsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBSyxJQUFJLENBQUMsSUFBSSxPQUFJLENBQUM7UUFDM0MsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFLLFdBQWEsQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQU8sV0FBYSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBUyxXQUFhLENBQUM7SUFDM0MsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQTNCRCxJQTJCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBBIGBQcm9wZXJ0eUJpbmRpbmdgIHJlcHJlc2VudHMgYSBtYXBwaW5nIGJldHdlZW4gYSBwcm9wZXJ0eSBuYW1lXG4gKiBhbmQgYW4gYXR0cmlidXRlIG5hbWUuIEl0IGlzIHBhcnNlZCBmcm9tIGEgc3RyaW5nIG9mIHRoZSBmb3JtXG4gKiBgXCJwcm9wOiBhdHRyXCJgOyBvciBzaW1wbHkgYFwicHJvcEFuZEF0dHJcIiB3aGVyZSB0aGUgcHJvcGVydHlcbiAqIGFuZCBhdHRyaWJ1dGUgaGF2ZSB0aGUgc2FtZSBpZGVudGlmaWVyLlxuICovXG5leHBvcnQgY2xhc3MgUHJvcGVydHlCaW5kaW5nIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIGJyYWNrZXRBdHRyITogc3RyaW5nO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgYnJhY2tldFBhcmVuQXR0ciE6IHN0cmluZztcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHBhcmVuQXR0ciE6IHN0cmluZztcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIG9uQXR0ciE6IHN0cmluZztcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIGJpbmRBdHRyITogc3RyaW5nO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgYmluZG9uQXR0ciE6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcDogc3RyaW5nLCBwdWJsaWMgYXR0cjogc3RyaW5nKSB7XG4gICAgdGhpcy5wYXJzZUJpbmRpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VCaW5kaW5nKCkge1xuICAgIHRoaXMuYnJhY2tldEF0dHIgPSBgWyR7dGhpcy5hdHRyfV1gO1xuICAgIHRoaXMucGFyZW5BdHRyID0gYCgke3RoaXMuYXR0cn0pYDtcbiAgICB0aGlzLmJyYWNrZXRQYXJlbkF0dHIgPSBgWygke3RoaXMuYXR0cn0pXWA7XG4gICAgY29uc3QgY2FwaXRhbEF0dHIgPSB0aGlzLmF0dHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmF0dHIuc3Vic3RyKDEpO1xuICAgIHRoaXMub25BdHRyID0gYG9uJHtjYXBpdGFsQXR0cn1gO1xuICAgIHRoaXMuYmluZEF0dHIgPSBgYmluZCR7Y2FwaXRhbEF0dHJ9YDtcbiAgICB0aGlzLmJpbmRvbkF0dHIgPSBgYmluZG9uJHtjYXBpdGFsQXR0cn1gO1xuICB9XG59XG4iXX0=