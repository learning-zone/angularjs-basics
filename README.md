## AngularJS Interview Questions 


#### Q. Factory vs Service

> factories are functions that return the object, while services are constructor functions of the object which are instantiated with the new keyword.
> Both are singletons, even though the name “factory” might imply differently.


#### Q.	Directive Example

```javascript
.directive("enter", function(){
	return function(scope, element){
		element.bind("mouseenter", function(){
			console.log("I'm inside!");
		})
	}
});
```


#### Q.	IIFE pattern used in AngularJS

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Angular Js</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
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

#### Q.	Filter used in JavaScript part

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

#### Q.	Factory in AngularJS

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

#### Q.	Value in AngularJS

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

#### Q.	Creating Sub-Module in AngularJS ( Extending Module in AngularJS )

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

#### Q.	config() vs run()

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

#### Q.	Provider

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

#### Q.	Provider with Constant

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

#### Q.	Component vs Module in AngularJS

Components controls views (html). Also communicates with other components and services.

Modules consist of one or more components. They do not control any html. Modules declare which components can be used by components belonging to other modules, which classes will be injected by dependency injector and which component gets bootstrapped.


#### Q.	AngularJS Components

```
> templateUrl
> $stateParams --> 
> $state.go -->
> $state -->
> $event -->
> $routeChangeError
```
+function() { console.log("Foo!"); }(); --> It forces the parser to treat the part following the + as an expression. This is usually used for functions that are invoked immediately. + is just one of the options. It can also be -, !, ~, or just about any other unary operator

 
