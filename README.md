# AngularJS Basics

> *Click &#9733; if you like the project. Your contributions are heartily ♡ welcome.*

<br/>

## Table of Contents

### Basics

|Sl.No|  Questions                                     |
|-----|------------------------------------------------|
| 01. |[Why to use AngularJS?](#q-why-to-use-angularjs)|
| 02. |[What are the advantage of AngularJS?](#q-what-are-the-advantage-of-angularjs)|
| 03. |[Please explain what is controller/model/view in angularjs?](#q-please-explain-what-is-controller-model-view-in-angularjs)|
| 04. |[Please tell about life cycle of angularjs application?](#q-please-tell-about-life-cycle-of-angularjs-application)|
| 05. |[What is jQLite/jQuery Lite?](#q-what-is-jqlite-jquery-lite)|
| 06. |[How to access jQLite?](#q-how-to-access-jqlite)|
| 07. |[What are the AngularJS features?](#q-what-are-the-angularjs-features)|
| 08. |[When dependent modules of a module are loaded?](#q-when-dependent-modules-of-a-module-are-loaded)|
| 09. |[What is Angular’s prefixes $ and $$?](#q-what-is-angular-s-prefixes-and)|
| 10. |[What is the role of ng-app, ng-init and ng-model directives?](#q-what-is-the-role-of-ng-app-ng-init-and-ng-model-directives)|
| 11. |[What are different ways to invoke a directive?](#q-what-are-different-ways-to-invoke-a-directive)|
| 12. |[What is restrict option in directive?](#q-what-is-restrict-option-in-directive)|
| 13. |[Can you define multiple restrict options on a directive?](#q-can-you-define-multiple-restrict-options-on-a-directive)|
| 14. |[What is scope in AngularJS?](#q-what-is-scope-in-angularjs)|
| 15. |[What is $scope and $rootScope?](#q-what-is-scope-and-rootscope)|
| 16. |[What is scope hierarchy?](#q-what-is-scope-hierarchy)|
| 17. |[What is the difference between $scope and scope?](#q-what-is-the-difference-between-scope-and-scope)|
| 18. |[How AngularJS compilation is different from other JavaScript frameworks?](#q-how-angularjs-compilation-is-different-from-other-javascript-frameworks)|
| 19. |[What are Compile, Pre and Post linking in AngularJS?](#q-what-are-compile-pre-and-post-linking-in-angularjs)|
| 20. |[Is it a good or bad practice to use AngularJS together with jQuery?](#q-is-it-a-good-or-bad-practice-to-use-angularjs-together-with-jquery)|
| 21. |[If you were to migrate from Angular 1.4 to 1.5, what is the main thing that would need refactoring?](#q-if-you-were-to-migrate-from-angular-14-to-15-what-is-the-main-thing-that-would-need-refactoring)|
| 22. |[What is the difference between one-way binding and two-way binding?](#q-what-is-the-difference-between-one-way-binding-and-two-way-binding)|
| 23. |[How would you specify that a scope variable should have one-time binding only?](#q-how-would-you-specify-that-a-scope-variable-should-have-one-time-binding-only)|
| 24. |[What directive would you use to hide elements from the HTML DOM by removing them from that DOM not changing their styling?](#q-what-directive-would-you-use-to-hide-elements-from-the-html-dom-by-removing-them-from-that-dom-not-changing-their-styling)|
| 25. |[How do you reset a $timeout, $interval(), and disable a $watch()?](#q-how-do-you-reset-a-timeout-interval-and-disable-a-watch)|
| 26. |[What is $scope in AngularJS?](#q-what-is-scope-in-angularjs)|
| 27. |[What is difference between $scope and scope?](#q-what-is-difference-between-scope-and-scope)|
| 28. |[How would you validate a text input field for a twitter username, including the @ symbol?](#q-how-would-you-validate-a-text-input-field-for-a-twitter-username-including-the-symbol)|
| 29. |[How do you hide an HTML element via a button click in AngularJS?](#q-how-do-you-hide-an-html-element-via-a-button-click-in-angularjs)|
| 30. |[How would you react on model changes to trigger some further action? For instance, say you have an input text field called email and you want to trigger or execute some code as soon as a user starts to type in their email?](#q-how-would-you-react-on-model-changes-to-trigger-some-further-action-for-instance-say-you-have-an-input-text-field-called-email-and-you-want-to-trigger-or-execute-some-code-as-soon-as-a-user-starts-to-type-in-their-email)|
| 31. |[How do you disable a button depending on a checkbox’s state?](#q-how-do-you-disable-a-button-depending-on-a-checkbox-s-state)|
| 32. |[Assuming "form" is an NgForm object, which property is used to retrieve the form values?](#q-assuming-form-is-an-ngform-object-which-property-is-used-to-retrieve-the-form-values)|

### Architecture

|Sl.No| Questions                                                             |
|-----|-----------------------------------------------------------------------|
| 33. |[What are the differences between `Provider` vs `Factory` vs `Service`?](#q-what-are-the-differences-between-provider-vs-factory-vs-service-)|
| 34. |[How do you prefer to develop the data access layer which communicate with REST service?](#q-how-do-you-prefer-to-develop-the-data-access-layer-which-communicate-with-rest-service)|
| 35. |[Which service do you use: `$http` or `$resourse` or `rest-angular`?](#q-which-service-do-you-use-http-or-resourse-or-rest-angular-)|
| 36. |[How can you configure `$http` service?](#q-how-can-you-configure-http-service)|
| 37. |[What about `q` and promises in angularjs?](#q-what-about-q-and-promises-in-angularjs)|
| 38. |[Explain Event model in angularjs?](#q-explain-event-model-in-angularjs)|
| 39. |[Do you use some sort of angular style guides?](#q-do-you-use-some-sort-of-angular-style-guides)|
| 40. |[What is dependency injection? Explain difference between inline and explicit annotation?](#q-what-is-dependency-injection-explain-difference-between-inline-and-explicit-annotation)|
| 41. |[What is auto bootstrap process in AngularJS?](#q-what-is-auto-bootstrap-process-in-angularjs)|
| 42. |[What is manual bootstrap process in AngularJS?](#q-what-is-manual-bootstrap-process-in-angularjs)|
| 43. |[How AngularJS is compiled?](#q-how-angularjs-is-compiled)|
| 44. |[What should be the maximum number of concurrent "watches"? How would you keep an eye on that number?](#q-what-should-be-the-maximum-number-of-concurrent-watches-how-would-you-keep-an-eye-on-that-number)|
| 45. |[Where should we implement the DOM manipulation in AngularJS?](#q-where-should-we-implement-the-dom-manipulation-in-angularjs)|
| 46. |[How `$digest` works?](#q-how-digest-works)|
| 47. |[What is a digest cycle in AngularJS?](#q-what-is-a-digest-cycle-in-angularjs)|
| 48. |[Explain how $scope.$apply() works?](#q-explain-how-scope-apply-works)|
| 49. |[What makes the angular.copy() method so powerful?](#q-what-makes-the-angularcopy-method-so-powerful)|
| 50. |[What is a singleton pattern and where we can find it in AngularJS?](#q-what-is-a-singleton-pattern-and-where-we-can-find-it-in-angularjs)|

### Directives

|Sl.No|  Questions                                                             |
|-----|------------------------------------------------------------------------|
| 51. |[What are directives in angularjs?](#q-what-are-directives-in-angularjs)|
| 52. |[List some built-in directives](#q-list-some-built-in-directives)
| 53. |[Explain difference between 'compile' and 'link' callbacks in directive definition](#q-explain-difference-between-compile-and-link-callbacks-in-directive-definition)
| 54. |[List types of scopes directive can have?](#q-list-types-of-scopes-directive-can-have)|
| 55. |[How Directives are compiled?](#q-how-directives-are-compiled)|
| 56. |[What are the directives in angularJS?](#q-what-are-the-directives-in-angularjs)|
| 57. |[What are different ways to invoke a directive?](#q-what-are-different-ways-to-invoke-a-directive)|
| 58. |[What is the difference between ng-show/ng-hide and ng-if directives?](#q-what-is-the-difference-between-ng-show-ng-hide-and-ng-if-directives)|
| 59. |[When creating a directive, it can be used in several different ways in the view. Which ways for using a directive do you know? How do you define the way your directive will be used?](#q-when-creating-a-directive-it-can-be-used-in-several-different-ways-in-the-view-which-ways-for-using-a-directive-do-you-know-how-do-you-define-the-way-your-directive-will-be-used)|
| 60. |[When should you use an attribute Vs an element?](#q-when-should-you-use-an-attribute-vs-an-element)|
| 61. |[What is the role of ng-app, ng-init and ng-model directives?](#q-what-is-the-role-of-ng-app-ng-init-and-ng-model-directives)|
| 62. |[How would you programatically change or adapt the template of a directive before it is executed and transformed?](#q-how-would-you-programatically-change-or-adapt-the-template-of-a-directive-before-it-is-executed-and-transformed)|
| 63. |[What is the Router directive that can be placed on elements to navigate to a new route?](#q-what-is-the-router-directive-that-can-be-placed-on-elements-to-navigate-to-a-new-route)|

### Filters

|Sl.No|  Questions                                                       |
|-----|------------------------------------------------------------------|
| 64. |[What are Filters in AngularJS?](#q-what-are-filters-in-angularjs)|
| 65. |[What are the basics steps to unit test an AngulatJS filter?](#q-what-are-the-basics-steps-to-unit-test-an-angulatjs-filter)|

### Service

|Sl.No|  Questions                                                                                           |
|-----|------------------------------------------------------------------------------------------------------|
| 66. |[What is difference between services and factory?](#q-what-is-difference-between-services-and-factory)|
| 67. |[How do you share data between controllers?](#q-how-do-you-share-data-between-controllers)|
| 68. |[How would you make an Angular service return a promise? Write a code snippet as an example?](#q-how-would-you-make-an-angular-service-return-a-promise--write-a-code-snippet-as-an-example)|
| 69. |[What is the role of services in AngularJS and name any services made available by default?](#q-what-is-the-role-of-services-in-angularjs-and-name-any-services-made-available-by-default)|
| 70. |[What is an interceptor?](#q-what-is-an-interceptor)|
| 71. |[What are common uses of an interceptor in AngularJS?](#q-what-are-common-uses-of-an-interceptor-in-angularjs)|
| 72. |[How would you implement application-wide exception handling in your Angular app?](#q-how-would-you-implement-application-wide-exception-handling-in-your-angular-app)|
| 73. |[In angular, what does the calls to the HTTP methods return?](#q-in-angular--what-does-the-calls-to-the-http-methods-return)|
| 74. |[Using the Angular Http module to make a request, which method is used to listen for an emitted response?](#q-using-the-angular-http-module-to-make-a-request--which-method-is-used-to-listen-for-an-emitted-response)|
| 75. |[An Angular class that used to create an instance that will be an argument to the request method of http is?](#q-an-angular-class-that-used-to-create-an-instance-that-will-be-an-argument-to-the-request-method-of-http-is)| 

### Miscellaneous

|Sl.No|  Questions                                                                                                  |
|-----|-------------------------------------------------------------------------------------------------------------|
| 76. |[What is the best practice to build your application](#q-what-is-the-best-practice-to-build-your-application)|
| 77. |[When it is necessary or whether it is necessary to use `$scope.$apply`](#q-when-it-is-necessary-or-whether-it-is-necessary-to-use---scope-apply)|
| 78. |[A JSON Web Token consists of?](#q-a-json-web-token-consists-of)|
| 79. |[A JWT should be signed with a secret called?](#q-a-jwt-should-be-signed-with-a-secret-called)|
| 80. |[Having the JWT token, what is the format of the Authorization header looks like?](#q-having-the-jwt-token--what-is-the-format-of-the-authorization-header-looks-like)|

<br/>

## Q. ***Why to use AngularJS?***

There are following reasons to choose AngularJS as a web development framework:

1. It is based on MVC pattern which helps you to organize your web apps or web application properly.
2. It extends HTML by attaching directives to your HTML markup with new attributes or tags and expressions
in order to define very powerful templates.
3. It also allows you to create your own directives, making reusable components that fill your needs and
abstract your DOM manipulation logic.
4. It supports two-way data binding i.e. connects your HTML (views) to your JavaScript objects (models)
seamlessly. In this way any change in model will update the view and vice versa without any DOM
manipulation or event handling.
5. It encapsulates the behavior of your application in controllers which are instantiated with the help of
dependency injection.
6. It supports services that can be injected into your controllers to use some utility code to fullfil your need.
For example, it provides $http service to communicate with REST service.
7. It supports dependency injection which helps you to test your angular app code very easily.
8. Also, AngularJS is mature community to help you. It has widely support over the internet.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are the advantage of AngularJS?***

There are following advantages of AngularJS:

1. **Data Binding** - AngularJS provides a powerful data binding mechanism to bind data to HTML elements by using scope.
2. **Customize & Extensible** - AngularJS is customized and extensible as per you requirement. You can create your own custom components like directives, services etc.
3. **Code Reusability** - AngularJS allows you to write code which can be reused. For example custom directive which you can reuse.
4. **Support** – AngularJS is mature community to help you. It has widely support over the internet. Also, AngularJS is supported by Google which gives it an advantage.
5. **Compatibility** - AngularJS is based on JavaScript which makes it easier to integrate with any other JavaScript library and runnable on browsers like IE, Opera, FF, Safari, Chrome etc.
6. **Testing** - AngularJS is designed to be testable so that you can test your AngularJS app components as easy as possible. It has dependency injection at its core, which makes it easy to test.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is jQLite/jQuery Lite?***

jQLite is a subset of jQuery that is built directly into AngularJS. jQLite provides you all the useful features of jQuery. In fact it provides you limited features or functions of jQuery.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How to access jQLite?***

jQuery lite or the full jQuery library if available, can be accessed via the AngularJS code by using the element(Q. function in AngularJS. Basically, ```angular.element()``` is an alias for the jQuery function.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are the AngularJS features?***

The features of AngularJS are listed below:

1. Modules
2. Directives
3. Templates
4. Scope
5. Expressions
6. Data Binding
7. MVC (Model, View & Controller)
8. Validations
9. Filters
10. Services
11. Routing
12. Dependency Injection
13. Testing

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***When dependent modules of a module are loaded?***

A module might have dependencies on other modules. The dependent modules are loaded by angular
before the requiring module is loaded.
In other words the configuration blocks of the dependent modules execute before the configuration blocks of the requiring module. The same is true for the run blocks. Each module can only be loaded once, even if multiple other modules require it.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is Angular’s prefixes $ and $$?***

To prevent accidental name collisions with your code, Angular prefixes names of public objects with $ and
names of private objects with $$. So, do not use the $ or $$ prefix in your code.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are Filters in AngularJS?***

Filters are used to format data before displaying it to the user. They can be used in view templates, controllers, services and directives. There are some built-in filters provided by AngularJS like as Currency, Date, Number, OrderBy, Lowercase, Uppercase etc. You can also create your own filters.

Filter Syntax

```javascript
  {{ expression | filter}}
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are Directives in AngularJS?***

AngularJS directives are a combination of AngularJS template markups (HTML attributes or elements, or CSS classes) and supporting JavaScript code. The JavaScript directive code defines the template data and behaviors of the HTML elements.

AngularJS directives are used to extend the HTML vocabulary i.e. they decorate html elements with new behaviors and help to manipulate html elements attributes in interesting way.

There are some built-in directives provided by AngularJS like as ng-app, ng-controller, ng-repeat, ng-model etc.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is the role of ng-app, ng-init and ng-model directives?***

The main role of these directives is explained as:

- ```ng-app``` - Initialize the angular app.
- ```ng-init``` - Initialize the angular app data.
- ```ng-model``` - Bind the html elem

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are different ways to invoke a directive?***

There are four methods to invoke a directive in your angular app which are equivalent.

| Method          | Syntax |
|-----------------|--------|
| As an attribute |    ```<span my-directive></span>```    |
| As a class      |    ```<span class="my-directive: expression;"></span>```    |
| As an element   |    ```<my-directive></my-directive>```    |
| As a comment    |    ```<!-- directive: my-directive expression -->```    |

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is restrict option in directive?***

The restrict option in angular directive, is used to specify how a directive will be invoked in your angular app i.e. as an attribute, class, element or comment.

There are four valid options for restrict:

```html
'A' (Attribute)- <span my-directive></span>
'C' (Class)- <span class="my-directive:expression;"></span>
'E' (Element)- <my-directive></my-directive>
'M' (Comment)- <!-- directive: my-directive expression -->
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***Can you define multiple restrict options on a directive?***

You can also specify multiple restrict options to support more than one methods of directive invocation as an element or an attribute. Make sure all are specified in the restrict keyword as: ```restrict: 'EA'``` .

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is auto bootstrap process in AngularJS?***

Angular initializes automatically upon ```DOMContentLoaded``` event or when the angular.js script is downloaded to the browser and the ```document.readyState``` is set to ```complete```. At this point AngularJS looks for the ```ng-app``` directive which is the root of angular app compilation and tells about AngularJS part within DOM. When the ```ng-app``` directive is found then Angular will:

1. Load the module associated with the directive.
2. Create the application injector.
3. Compile the DOM starting from the ng-app root element.
This process is called auto-bootstrapping.

```html
<!doctype html>
<html>
<body ng-app="myApp">
<div ng-controller="Ctrl"> Hello {{msg}}!
</div>
    <script src="lib/angular.js"></script>
    <script>
var app = angular.module('myApp', []); app.controller('Ctrl', function ($scope) {
              $scope.msg = 'World';
          });
    </script>
</body>
</html>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is manual bootstrap process in AngularJS?***

You can manually initialized your angular app by using **angular.bootstrap()** function. This function takes the modules as parameters and should be called within **angular.element(document).ready()** function. The **angular.element(document).ready()** function is fired when the DOM is ready for manipulation.

```html
<!doctype html>
<html>
<body>
    <div ng-controller="Ctrl"> Hello {{msg}}! </div>
<script src="lib/angular.js"></script>
<script>
  var app = angular.module('myApp', []);
  app.controller('Ctrl', function ($scope) {
        $scope.msg = 'World';
    });
  //manual bootstrap process
  angular.element(document).ready(function () { angular.bootstrap(document, ['myApp']);
  });
</script>
</body>
</html>
```

Note:

- You should not use the ng-app directive when manually bootstrapping your app.
- You should not mix up the automatic and manual way of bootstrapping your app.
- Define modules, controller, services etc. before manually bootstrapping your app as defined in above example.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is scope in AngularJS?***

Scope is a JavaScript object that refers to the application model. It acts as a context for evaluating angular expressions. Basically, it acts as glue between controller and view.

Scopes are hierarchical in nature and follow the DOM structure of your AngularJS app. AngularJS has two scope objects: **$rootScope** and **$scope**.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is $scope and $rootScope?***

**$scope** - A $scope is a JavaScript object which is used for communication between controller and view. Basically, $scope binds a view (DOM element) to the model and functions defined in a controller.

**$rootScope** - The $rootScope is the top-most scope. An app can have only one $rootScope which will be shared among all the components of an app. Hence it acts like a global variable. All other $scopes are children of the $rootScope.
For example, suppose you have two controllers: Ctrl1 and Ctrl2 as given below:

```html
<!doctype html>
<html>
  <body ng-app="myApp">
      <div ng-controller="Ctrl1" style="border:2px solid blue; padding:5px"> Hello {{msg}}! <br />
        Hello {{name}}! (rootScope) </div> <br />
      <div ng-controller="Ctrl2" style="border:2px solid green; padding:5px">
        Hello {{msg}}! <br />
        Hey {{myName}}! <br />
        Hi {{name}}! (rootScope) 
      </div>
  <script src="lib/angular.js"></script>
  <script>
        var app = angular.module('myApp', []); 
        app.controller('Ctrl1', function ($scope, $rootScope) {
          $scope.msg = 'Hello';
          $rootScope.name = 'AngularJS';
        });
        app.controller('Ctrl2', function ($scope, $rootScope) { 
          $scope.msg = 'World';
          $scope.myName = $rootScope.name;
        });
    </script>
  </body>
</html>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is scope hierarchy?***

The **$scope** object used by views in AngularJS are organized into a hierarchy. There is a root scope, and the **$rootScope** can has one or more child scopes. Each controller has its own **$scope** (which is a child of the **$rootScope**), so whatever variables you create on $scope within controller, these variables are accessible by the view based on this controller.

For example, suppose you have two controllers: ParentController and ChildController as given below:

```html
<!doctype html>
<html>
  <head>
  <script src="lib/angular.js"></script>
  <script>
    var app = angular.module('ScopeChain', []);
    app.controller("parentController", function ($scope) {
	$scope.managerName = 'Shailendra Chauhan';
	$scope.$parent.companyName = 'Dot Net Tricks'; //attached to $rootScope
    });
    app.controller("childController", function ($scope, $controller) {
        $scope.teamLeadName = 'Deepak Chauhan';
    });
  </script>
</head>
<body ng-app="ScopeChain">
	<div ng-controller="parentController ">
		<table style="border:2px solid #e37112">
		<caption>Parent Controller</caption>
		<tr>
        	   <td>Manager Name</td>
		   <td>{{managerName}}</td>
		</tr>
		<tr>
                    <td>Company Name</td>
		    <td>{{companyName}}</td>
		</tr>
		<tr>
		    <td><table ng-controller="childController" style="border:2px solid #428bca;">
			<caption>Child Controller</caption>
			<tr>
                            <td>Team Lead Name</td>
                            <td>{{ teamLeadName }}</td>
                  </tr>
		  <tr>
                      <td>Reporting To</td>
                      <td>{{managerName}}</td>
                  </tr>
                  <tr>
                      <td>Company Name</td>
                      <td>{{companyName}}</td>
                 </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is the difference between $scope and scope?***

The module factory methods like controller, directive, factory, filter, service, animation, config and run receive arguments through dependency injection (DI). In case of DI, you inject the **scope object** with the dollar prefix i.e. **$scope**. The reason is the **injected arguments** must match to the names of **injectable objects** followed by dollar ($) prefix.
**For example**, you can inject the scope and element objects into a controller as given below:

```javascript
module.controller('MyController', function ($scope, $element) { // injected arguments });
```

When the methods like directive linker function don’t receive arguments through dependency injection, you just pass the **scope object** without using dollar prefix i.e. **scope**. The reason is the passing arguments are received by its caller.

```javascript
module.directive('myDirective', function () // injected arguments here {
    return {
        // linker function does not use dependency injection
        link: function (scope, el, attrs) {
        /** The calling function will passes the three arguments to the linker: 
            scope, element and attributes, in the same order **/
	} };
});
```

In the case of non-dependency injected arguments, you can give the name of injected objects as you wish. The above code can be re-written as:

```javascript
module.directive("myDirective", function () {
	return {
        link: function (s, e, a) {
            // s == scope
	} };
});
// e == element
```

In short, in case of DI the **scope object** is received as **$scope** while in case of non-DI **scope object** is received as **scope** or with any name.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How AngularJS is compiled?***

Angular's HTML compiler allows you to teach the browser new HTML syntax. The compiler allows you to attach new behaviors or attributes to any HTML element. Angular calls these behaviors as directives.
AngularJS compilation process takes place in the web browser; no server side or pre-compilation step is involved.
Angular uses $compiler service to compile your angular HTML page. The angular' compilation process begins after your HTML page (static DOM) is fully loaded. It happens in two phases:

1. Compile - It traverse the DOM and collect all of the directives. The result is a linking function.
2. Link - It combines the directives with a scope and produces a live view. Any changes in the scope model are reflected in the view, and any user interactions with the view are reflected in the scope model.

The concept of compile and link comes from C language, where you first compile the code and then link it to actually execute it. The process is very much similar in AngularJS as well.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How AngularJS compilation is different from other JavaScript frameworks?***

If you have worked on templates in other java script framework/library like backbone and jQuery, they process the template as a string and result as a string. You have to dumped this result string into the DOM where you wanted it with **innerHTML()**.

AngularJS process the template in another way. It directly works on HTML DOM rather than strings and manipulates it as required. It uses two way data-binding between model and view to sync your data.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How Directives are compiled?***

It is important to note that Angular operates on DOM nodes rather than strings. Usually, you don't notice
this because when an html page loads, the web browser parses HTML into the DOM automatically. HTML compilation happens in three phases:

1. The $compile traverses the DOM and looks for directives. For each directive it finds, it adds it to a list of directives.
2. Once the entire DOM has been traversed, it will sort that list of directives by their priority. Then, each directive’s own compile function is executed, giving each directive the chance to modify the DOM itself. Each compile function returns a linking function, which is then composed into a combined linking function and returned.
3. $compile links the template with the scope by calling the combined linking function from the previous step. This in turn will call the linking function of the individual directives, registering listeners on the elements and setting up $watch with the scope as each directive is configured to do.

The pseudo code for the above process is given below:

```javascript
var $compile = ...; // injected into your code
var scope = ...;
var parent = ...; // DOM element where the compiled template can be appended
var html = '<div ng-bind="exp"></div>';
// Step 1: parse HTML into DOM element
var template = angular.element(html);
// Step 2: compile the template
var linkFn = $compile(template);
// Step 3: link the compiled template with the scope.
var element = linkFn(scope);
// Step 4: Append to DOM (optional)
parent.appendChild(element);
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are Compile, Pre and Post linking in AngularJS?***

* **Compile** – This compiles an HTML string or DOM into a template and produces a template function, which
can then be used to link scope and the template together.
Use the compile function to change the original DOM (template element) before AngularJS creates an instance of it and before a scope is created.

* **Post-Link** – This is executed after the child elements are linked. It is safe to do DOM transformation in the post- linking function.
Use the post-link function to execute logic, knowing that all child elements have been compiled and all pre-link and post-link functions of child elements have been executed.

* **Pre-Link** – This is executed before the child elements are linked. Not safe to do DOM transformation since the compiler linking function will fail to locate the correct elements for linking.
Use the pre-link function to implement logic that runs when AngularJS has already compiled the child elements, but before any of the child element's post-link functions have been called.


```html
<!doctype html>
<html>
  <head>
  <title>Compile vs Link</title>
  <script src="lib/angular.js"></script>
  <script type="text/javascript">
    var app = angular.module('app', []);

    function createDirective(name) {
      return function () {
        return {
          restrict: 'E',
          compile: function (tElem, tAttrs) {
            console.log(name + ': compile');

            return {
              pre: function (scope, iElem, attrs) {
                console.log(name + ': pre link');
              },
              post: function (scope, iElem, attrs) {
                console.log(name + ': post link');
              }
            }

          }
        }
      }
    };
    app.directive('levelOne', createDirective('level-One'));
    app.directive('levelTwo', createDirective('level-Two'));
    app.directive('levelThree', createDirective('level-Three'));
  </script>
  </head>
  <body ng-app="app">
    <level-one>
      <level-two>
        <level-three>
          Hello {{name}}
        </level-three>
      </level-two>
    </level-one>
  </body>
</html>
```

Output:

```shell
level-One: compile
level-Two: compile
level-Three: compile
level-One: pre link
level-Two: pre link
level-Three: pre link
level-Three: post link
level-Two: post link
level-One: post link
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are the directives in angularJS?***

AngularJS directives are a combination of AngularJS template markups (HTML attributes or elements, or
CSS classes) and supporting JavaScript code.The JavaScript directive code defines the template data and
behaviors of the HTML elements.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is difference between $scope and scope?***

$scope - In case of DI, you inject the scope object with the dollar prefix i.e. $scope. The reason is 
the injected arguments must match to the names of injectable objects followed by dollar ($) prefix .
	
scope - When the methods like directive linker function don’t receive arguments through dependency injection,
you just pass the scope object without using dollar prefix i.e. scope. The reason is the passing arguments 
are received by its caller.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is difference between services and factory?***

Service - It is just a function for the business layer of the application . It is act as a constauctor function
and invoked once at a run time with new keyword.
	
factory - Factory give you the same capability of as .serice() , but it is more powerful and flexible . 
A factory is a design pattern . Factory create objetcs such as new class instances , returns object literals,
return functions and closures or even just return a simply string.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are the basics steps to unit test an AngulatJS filter?***

1. Inject the module that contains the filter.
2. Provide any mocks that the filter relies on.
3. Get an instance of the filter using $filter('yourFilterName').
4. Assert your expectations.

Dependency injection is a powerful software design pattern that Angular employs to compose responsibilities through an intrinsic interface. However, for those new to the process, it can be puzzling where you need to configure and mock these dependencies when creating your isolated unit tests. The open-source project “Angular Test Patterns” is a free resource that is focused on dispelling such confusion through high-quality examples.

This question is useful since it can give you a feel for how familiar the candidate is with automated testing (TDD, BDD, E2E), as well as open up a conversation about approaches to code quality.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What should be the maximum number of concurrent "watches"? How would you keep an eye on that number?***

To reduce memory consumption and improve performance it is a good idea to limit the number of watches on a page to 2,000. A utility called `ng-stats` can help track your watch count and digest cycles.

Jank happens when your application cannot keep up with the screen refresh rate. To achieve 60 frames-per-second, you only have about 16 milliseconds for your code to execute. It is crucial that the scope digest cycles are as short as possible for your application to be responsive and smooth. Memory use and digest cycle performance are directly affected by the number of active watches. Therefore, it is best to keep the number of watches below 2,000. The open-source utility ng-stats gives developers insight into the number of watches Angular is managing, as well as the frequency and duration of digest cycles over time.

**Caution:** Be wary of relying on a “single magic metric” as the golden rule to follow. You must take the context of your application into account. The number of watches is simply a basic health signal. If you have many thousands of watches, or worse, if you see that number continue to grow as you interact with your page. Those are strong indications that you should look under the hood and review your code.

This question is valuable as it gives insight into how the candidate debugs runtime issues while creating a discussion about performance and optimization.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How do you share data between controllers?***

Create an AngularJS service that will hold the data and inject it inside of the controllers.

Using a service is the cleanest, fastest and easiest way to test.
However, there are couple of other ways to implement data sharing between controllers, like:
– Using events
– Using $parent, nextSibling, controllerAs, etc. to directly access the controllers
– Using the $rootScope to add the data on (not a good practice)
The methods above are all correct, but are not the most efficient and easy to test.
There is a good video explanation on egghead.io.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is the difference between ng-show/ng-hide and ng-if directives?***
ng-show/ng-hide will always insert the DOM element, but will display/hide it based on the condition. ng-if will not insert the DOM element until the condition is not fulfilled.

ng-if is better when we needed the DOM to be loaded conditionally, as it will help load page bit faster compared to ng-show/ng-hide.

We only need to keep in mind what the difference between these directives is, so deciding which one to use totally depends on the task requirements.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is a digest cycle in AngularJS?***

In each digest cycle Angular compares the old and the new version of the scope model values. The digest cycle is triggered automatically. We can also use $apply() if we want to trigger the digest cycle manually.

For more information, take a look in the ng-book explanation: The Digest Loop and $apply

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***Where should we implement the DOM manipulation in AngularJS?***

In the directives. DOM Manipulations should not exist in controllers, services or anywhere else but in directives.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***Is it a good or bad practice to use AngularJS together with jQuery?***
It is definitely a bad practice. We need to stay away from jQuery and try to realize the solution with an AngularJS approach. jQuery takes a traditional imperative approach to manipulating the DOM, and in an imperative approach, it is up to the programmer to express the individual steps leading up to the desired outcome.

AngularJS, however, takes a declarative approach to DOM manipulation. Here, instead of worrying about all of the step by step details regarding how to do the desired outcome, we are just declaring what we want and AngularJS worries about the rest, taking care of everything for us.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***If you were to migrate from Angular 1.4 to 1.5, what is the main thing that would need refactoring?***
Changing .directive to .component to adapt to the new Angular 1.5 components

## Q. ***How would you specify that a scope variable should have one-time binding only?***
By using “::” in front of it. This allows the check if the candidate is aware of the available variable bindings in AngularJS.

## Q. ***What is the difference between one-way binding and two-way binding?***

– One way binding implies that the scope variable in the html will be set to the first value its model is bound to (i.e. assigned to)

– Two way binding implies that the scope variable will change it’s value everytime its model is assigned to a different value

## Q. ***Explain how `$scope.$apply()` works?***

It will re-evaluates all the declared ng-models and applies the change to any that have been altered (i.e. assigned to a new value)

Explanation: $scope.$apply() is one of the core angular functions that should never be used explicitly, it forces the angular engine to run on all the watched variables and all external variables and apply the changes on their values

## Q. ***What directive would you use to hide elements from the HTML DOM by removing them from that DOM not changing their styling?***

The ngIf Directive, when applied to an element, will remove that element from the DOM if it’s condition is false.

## Q. ***What makes the `angular.copy()` method so powerful?***

It creates a deep copy of the variable.

A deep copy of a variable means it doesn’t point to the same memory reference as that variable. Usually assigning one variable to another creates a “shallow copy”, which makes the two variables point to the same memory reference. Therefore if we change one, the other changes as well

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How would you make an Angular service return a promise? Write a code snippet as an example?***

To add promise functionality to a service, we inject the “$q” dependency in the service, and then use it like so:

```javascript
angular.factory('testService', function($q){
	return {
		getName: function(){
			var deferred = $q.defer();

			//API call here that returns data
			testAPI.getName().then(function(name){
				deferred.resolve(name)
			})

			return deferred.promise;
		}
	}
})
```
The $q library is a helper provider that implements promises and deferred objects to enable asynchronous functionality

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is the role of services in AngularJS and name any services made available by default?***

– AngularJS Services are objects that provide separation of concerns to an AngularJS app.
– AngularJS Services can be created using a factory method or a service method.
– Services are singleton components. All components of the application (into which the service is injected) will work with single instance of the service.
– An AngularJS service allows developing of business logic without depending on the View logic which will work with it.

 Few of the inbuilt services in AngularJS are:
– the $http service: The $http service is a core Angular service that facilitates communication with the remote HTTP servers via the browser’s XMLHttpRequest object or via JSONP
– the $log service: Simple service for logging. Default implementation safely writes the message into the browser’s console
– the $anchorScroll: it scrolls to the element related to the specified hash or (if omitted) to the current value of $location.hash()
Why should one know about AngularJS Services, you may ask. Well, understanding the purpose of AngularJS Services helps bring modularity to AngularJS code.
Services are the best may to evolve reusable API within and AngularJS app

Overview:

AngularJS Services help create reusable components.
A Service can be created either using the service() method or the factory() method.
A typical service can be injected into another service or into an AngularJS Controller.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***When creating a directive, it can be used in several different ways in the view. Which ways for using a directive  do you know? How do you define the way your directive will be used?***

When you create a directive, it can be used as an attribute, element or class name. To define which way to use, you need to set the restrict option in your directive declaration.

The restrict option is typically set to:

‘A’ – only matches attribute name
‘E’ – only matches element name
‘C’ – only matches class name

These restrictions can all be combined as needed:

‘AEC’ – matches either attribute or element or class name

For more information, feel free to check out the AngularJS documentation.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***When should you use an attribute Vs an element?***

Use an element when you are creating a component that is in control of the template. Use an attribute when you are decorating an existing element with new functionality.

This topic is important so developers can understand the several ways a directive can be used inside a view and when to use each way.


## Q. ***How do you reset a `$timeout, $interval()`, and disable a `$watch()`?***

To reset a timeout and/or $interval, assign the result of the function to a variable and then call the .cancel() function.

```javascript
var customTimeout = $timeout(function () {

	 // arbitrary code
}, 55);

$timeout.cancel(customTimeout);
```

to disable $watch(), we call its deregistration function. $watch() then returns a deregistration function that we store to a variable and that will be called for cleanup
```javascript
var deregisterWatchFn = $scope.$on(‘$destroy’, function () {
	// we invoke that deregistration function, to disable the watch
		deregisterWatchFn();
});		
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is $scope in AngularJS?***

Scope is an object that refers to the application model. It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events. Scopes are objects that refer to the model. They act as glue between controller and view.

This question is important as it will judge a persons knowledge about a $scope object, and it is one of the most important concepts in AngularJS. Scope acts like a bridge between view and model.

## Q. ***What are Directives?***

Directives are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS’s HTML compiler ($compile) to attach a specified behavior to that DOM element (e.g. via event listeners), or even to transform the DOM element and its children. Angular comes with a set of these directives built-in, like ngBind, ngModel, and ngClass. Much like you create controllers and services, you can create your own directives for Angular to use. When Angular bootstraps your application, the HTML compiler traverses the DOM matching directives against the DOM elements.

This question is important because directives define the UI while defining a single page app. You need to be very clear about how to create a new custom directive or use the existing ones already pre-build in AngularJS.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is DDO `Directive Difinition Object`?***

DDO is an object used while creating a custome directive. A standard DDO object has following parameters.
```javascript
var directiveDefinitionObject = {
	priority: 0,
	template: '<div></div>', // or // function(tElement, tAttrs) { ... },
 	// or
	// templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
	transclude: false,
	restrict: 'A',
	templateNamespace: 'html',
	scope: false,
	controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
	controllerAs: 'stringIdentifier',
	bindToController: false,
	require: 'siblingDirectiveName', // or ['^parentDirectiveName', '?optionalDirectiveName', '? ^optionalParent'],
	compile: function compile(tElement, tAttrs, transclude) {
	  return {
		    pre: function preLink(scope, iElement, iAttrs, controller) { ... },
  		    post: function postLink(scope, iElement, iAttrs, controller) { ... }
  		}
  		// or
 		 // return function postLink( ... ) { ... }
	},
	// or
	// link: {
	//  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
	//  post: function postLink(scope, iElement, iAttrs, controller) { ... }
	// }
	// or
	// link: function postLink( ... ) { ... }
};
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What is a singleton pattern and where we can find it in AngularJS?***

Is a great pattern that restricts the use of a class more than once. We can find singleton pattern in angular in dependency injection and in the services.

In a sense, if you do 2 times ‘new Object()‘ without this pattern, you will be alocating 2 pieces of memory for the same object. With singleton pattern, if the object exists, you reuse it.


## Q. ***What is an interceptor?*** 

An interceptor is a middleware code where all the $http requests go through. The interceptor is a factory that are registered in `$httpProvider`.

## Q. ***What are common uses of an interceptor in AngularJS?***

There are two types of requests that go through the interceptor, request and response (with requestError and responseError respectively). This piece of code is very useful for error handling, authentication or middleware in all the requests/responses.


## Q. ***How would you programatically change or adapt the template of a directive before it is executed and transformed?***

You would use the compile function. The compile function gives you access to the directive’s template before transclusion occurs and templates are transformed, so changes can safely be made to DOM elements. This is very useful for cases where the DOM needs to be constructed based on runtime directive parameters.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How would you validate a text input field for a twitter username, including the @ symbol?***

You would use the ngPattern directive to perform a regex match that matches Twitter usernames. The same principal can be applied to validating phone numbers, serial numbers, barcodes, zip codes and any other text input.
Note: This directive is also added when the plain pattern attribute is used, with two differences:
ngPattern does not set the pattern attribute and therefore HTML5 constraint validation is not available.
The ngPattern attribute must be an expression, while the pattern value must be interpolated.

```html
<script>
 	 angular.module('ngPatternExample', [])
    		.controller('ExampleController', ['$scope', function($scope) {
     		 $scope.regex = '\\d+';
   	 }]);
</script>
<div ng-controller="ExampleController">
 	 <form name="form">
   	 <label for="regex">Set a pattern (regex string): </label>
   	 <input type="text" ng-model="regex" id="regex" />
   	 <br>
    	<label for="input">This input is restricted by the current pattern: </label>
    	<input type="text" ng-model="model" id="input" name="input" ng-pattern="regex" /><br>
    	<hr>
    	input valid? = <code>{{form.input.$valid}}</code><br>
   	 model = <code>{{model}}</code>
  	</form>
</div>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How would you implement application-wide exception handling in your Angular app?***

Angular has a built-in error handler service called $exceptionHandler which can easily be overriden as seen below:
```javascript
	myApp.factory('$exceptionHandler', function($log, ErrorService) {
   		 return function(exception, cause) {
        	if (console) {
          	  $log.error(exception);
          	  $log.error(cause);
      		  }
      			ErrorService.send(exception, cause);
   		 };	 
	});
```
This is very useful for sending errors to third party error logging services or helpdesk applications. Errors trapped inside of event callbacks are not propagated to this handler, but can manually be relayed to this handler by calling $exceptionHandler(e) from within a try catch block.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How do you hide an HTML element via a button click in AngularJS?***

You can do this by using the `ng-hide` directive in conjunction with a controller we can hide an HTML element on button click.
```html
<div ng-controller="MyCtrl">
	<button ng-click="hide()">Hide element</button>
	<p ng-hide="isHide">Hello World!</p>
</div>	

function MyCtrl($scope) {
	$scope.isHide = false;
	$scope.hide = function() {
	  $scope.isHide = true;
	}
}
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How would you react on model changes to trigger some further action? For instance, say you have an input text field called email and you want to trigger or execute some code as soon as a user starts to type in their email?***

We can achieve this using $watch function in our controller.
```javascript
function MyCtrl($scope) {
	$scope.email = "";

	$scope.$watch("email", function(newValue, oldValue) {
		if ($scope.email.length > 0) {
			console.log("User has started writing into email");
		}
	});
}	
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***How do you disable a button depending on a checkbox’s state?***

We can use the ng-disabled directive and bind its condition to the checkbox’s state.
```html
<body ng-app>
	<label><input type="checkbox" ng-model="checked"/>Disable Button</label>
	<button ng-disabled="checked">Select me</button>
</body>
```
## Q. ***In angular, what does the calls to the HTTP methods  return?***
In angular, calls to the HTTP methods actually return an observable and not a promise. You can think of an observable as a stream of events, and meeting values to anyone who has subscribed to it.

## Q. ***Using the Angular Http module to make a request, which method is used to listen for an emitted response?***
In Angular Http module to make a request,  method is used to listen for an emitted response.Subscribe

## Q. ***What is the Router directive that can be placed on elements to navigate to a new route?***
Router directive that can be placed on elements to navigate to a new route is `[routerLink]`.

## Q. ***Assuming "form" is an NgForm object, which property is used to retrieve the form values?***

The form value can be retrieved by `[form.value]`.

## Q. ***An Angular class that used to create an instance that will be an argument to the request method of http is?***
`[Request]`.


## Q. ***A JSON Web Token consists of?***
JSON Web Token consists of header, payload and signature. You can read more at https://jwt.io/

## Q. ***A JWT should be signed with a secret called ?***
High security password. Generating long, high-quality random passwords is
not simple. You can easily generate one via this link https://www.grc.com/passwords.htm

## Q. ***Having the JWT token, what is the format of the Authorization header looks like?***
The authorization header should be `Bearer [token]`.


## Q.	***Directive Example***

```javascript
.directive("enter", function(){
	return function(scope, element){
		element.bind("mouseenter", function(){
			console.log("I'm inside!");
		})
	}
});
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***IIFE Pattern used in AngularJS***

```html
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Angular Js</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
     integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.js"></script>

    <script src="persons.js"></script>
    <style>
        body { padding-top: 70px; }
    </style>
</head>
<body ng-app="app">
	<div ng-controller="IndexCtrl as vm">
		<h1>{{vm.greeting}} {{vm.name}}</h1>
		<input type="text" ng-model="vm.name">
   </div>
</body>
<script>
	(function(){

			angular.module('app', []);

			angular.module('app').controller('IndexCtrl', displayCtrl);

			displayCtrl.$inject = [];

			function displayCtrl (){
				this.greeting = "Hello";
				this.name = "Thomson";
			}
	
	})();
</script>	
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Filter used in JavaScript part***

```html
<body ng-app="app">
	<div ng-controller="IndexCtrl as vm">
		<h1>{{vm.greeting}} {{vm.name}}</h1>
		<input type="text" ng-model="vm.name">
	</div>
</body>
<script>
	(function(){

			angular.module('app', []);

			angular.module('app').controller('IndexCtrl', displayCtrl);

			displayCtrl.$inject = ['$filter'];

			function displayCtrl ($filter){
				this.greeting = $filter('uppercase')("Hello");
				this.name = "Thomson";
			}
	
	})();
</script>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Factory in AngularJS***

```html
<div ng-controller="IndexCtrl as vm">
	<h4>{{vm.greeting}} {{vm.name}} !!!</h4>
	<hr/>

	<input type="text" ng-model="vm.q"><br/>
	<div><b>Total Count : {{vm.count}}</b></div><br/>

		<ul>
			<li ng-repeat="person in vm.persons | filter:vm.q">
				{{person.name.first}} {{person.name.last}}
			</li>
		</ul>
</div>
<script>

  (function (angular) {
    'use strict';

        angular.module('app', []);

        angular.module('app').controller('IndexCtrl', indexCtrl);

        indexCtrl.$inject = ['store'];

        function indexCtrl(store) {
          var vm = this;

          vm.name = 'Thomson';
          vm.greeting = 'Hello';
          vm.persons = store.getPersons();
          vm.count = store.getPersonCount();
        }


      angular.module('app').factory('store', function(){
          function getPersons(){
            return persons;
          }

          function getPersonCount(){
            return getPersons().length;
          }
          return {
            getPersons: getPersons,
            getPersonCount: getPersonCount
          };
      });

  })(angular);

</script>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Value in AngularJS***

```javascript
 (function (angular) {
    'use strict';

        angular.module('app', []);

        angular.module('app').controller('IndexCtrl', indexCtrl);

        indexCtrl.$inject = ['appInfo'];

        function indexCtrl( appInfo) {
          var vm = this;

          vm.name = appInfo.name;
          vm.greeting = 'Hello';
          
        }

      angular.module('app').value('appInfo', {
        name: 'Thomson Angular Training App',
        version: '0.0.1',
        date: '2017-01-05'
      });

  })(angular);
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Creating Sub-Module in AngularJS ( Extending Module in AngularJS )***

```javascript
(function (angular) {
    'use strict';

        angular.module('app', ['app.util']);
        angular.module('app.util', []);

        angular.module('app').controller('IndexCtrl', indexCtrl);

        indexCtrl.$inject = ['store', 'appInfo'];

        function indexCtrl(store, appInfo) {
          var vm = this;

          vm.name = appInfo.name;
          vm.greeting = 'Hello';
          vm.persons = store.getPersons();
          vm.count = store.getPersonCount();
        }


      angular.module('app').factory('store', function(){
          function getPersons(){
            return persons;
          }

          function getPersonCount(){
            return getPersons().length;
          }
          return {
            getPersons: getPersons,
            getPersonCount: getPersonCount
          };
      });

      angular.module('app.util').value('appInfo', {
        name: 'Thomson Angular Training App',
        version: '0.0.1',
        date: '2017-01-05'
      });

  })(angular);
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***config() vs run()***

```javascript
(function (angular) {
    'use strict';
	
	  angular.module('app', []);
	 
	  angular.module('app').config(function(){ 		//Config Phase always execute first
        console.log('Config Phase');
      });

      angular.module('app').run(function(store){
        console.log('Run Phase', store.getPersons());
      });
	 
 })(angular);
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Provider***

```html
 <div class="container">
		<div ng-controller="IndexCtrl as vm">
				{{vm.hello.greeting('Thomson')}} // we can define function inside expression
		</div>
 </div>
 <script>
(function (angular){
     angular.module('app', [])

    .provider('hello', function(){
        var lang = 'en';
        var db = {
            en: 'Hello',
            hn: 'Namaste',
            fr: 'Bonjour'
        };

        this.setLang = function (input){
            lang = input;
        };

        this.$get = function () {
            return {
                greeting: function (name) {
                    return db[lang] + ' ' + name + ' !!!';
                }
            };
        };

    })

    .controller('IndexCtrl', function(hello) {
        var vm = this;
        
        vm.sayHello = function(name){
            return hello.greeting(name);
        };
    })

    .config(function (helloProvider){
        helloProvider.setLang('fr');
    });
})(angular);
 </script>
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Provider with Constant***

```html
 <div ng-controller="IndexCtrl as vm">
            {{vm.sayHello('Thomson')}}
            <br/> <br/>
	   <select ng-model='vm.lang' ng-change="vm.setLang()">
			<option value="en">English</option>
			<option value="hn">Hindi</option>
			<option value="fr">French</option>
		</select>
</div>
<script>
(function (angular){
     angular.module('app', [])

    .provider('hello', function(){
        var lang = 'en';
        var db = {
            en: 'Hello',
            hn: 'Namaste',
            fr: 'Bonjour'
        };

        function setLang (input){ //global function
            lang = input;
        }

        this.setLang = setLang;

        this.$get = function () {
            return {
                greeting: function (name) {
                    return db[lang] + ' ' + name + ' !!!';
                },

                setLang: setLang  // When we want to declare global function 
            };
        };

    })

    .controller('IndexCtrl', function(hello) {
        var vm = this;
        
        vm.sayHello = function(name){
            return hello.greeting(name);
        };

        vm.setLang = function() {
            hello.setLang(vm.lang);
        };
    })

    .constant('config', { // we can't inject "value service" inside config()
        lang: 'en'
    })

    .config(function (config, helloProvider){
        helloProvider.setLang(config.lang);
    });
})(angular);
</script>  
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***Component vs Module in AngularJS***

Components controls views (html). Also communicates with other components and services.

Modules consist of one or more components. They do not control any html. Modules declare which components can be used by components belonging to other modules, which classes will be injected by dependency injector and which component gets bootstrapped.

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q.	***AngularJS Components***

```
> templateUrl
> $stateParams --> 
> $state.go -->
> $state -->
> $event -->
> $routeChangeError
```
+function() { console.log("Foo!"); }(); --> It forces the parser to treat the part following the + as an expression. This is usually used for functions that are invoked immediately. + is just one of the options. It can also be -, !, ~, or just about any other unary operator

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

## Q. ***What are the differences between ng-repeat and ng-options and why do they not behave the same way?***

ng-repeat creates a new scope for each iteration so will not perform as well as ng-options.

For small lists, it will not matter, but larger lists should use ng-options. Apart from that, It provides lot of flexibility in specifying iterator and offers performance benefits over ng-repeat.

Example:
```html
<!-- ng-repeat Example -->
<select>
  <option ng-repeat="x in names">{{x}}</option>
</select>


<!-- ng-options Example -->
<select ng-model="selectedName" ng-options="x for x in names"></select>
```

```js
$scope.names = ["Emil", "Tobias", "Linus"];
```

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>

#### Q. ***What directives are user to show and hide HTML elements in AngularJS?***
#### Q. ***Explain directives ng-if, ng-switch and ng-repeat?***
#### Q. ***What are ng-repeat special variables?***
#### Q. ***How AngularJS handle data binding?***
#### Q. ***Please tell about life cycle of angularjs application?***
#### Q. ***Please explain what is controller/model/view in angularjs?***

*ToDo*

<div align="right">
    <b><a href="#">↥ back to top</a></b>
</div>
