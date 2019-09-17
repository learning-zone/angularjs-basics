'use strict';

// Main app config and initialisation
var app = angular.module('myApp', [
    'ng',
    'ngResource',
    'ngRoute',
    'myApp.controllers',
    'myApp.directives',
    'myApp.filters',
    'myApp.services' 
]);


// Configuration and routes
app.config(function($routeProvider, $locationProvider) {
   
    $routeProvider
        .when('/',                  { templateUrl: 'views/index.html', controller: 'IndexController', title: 'Home' })
        .when('/users',             { templateUrl: 'views/users.html', controller: 'UsersController', title: 'Users' })      
        .when('/user/create',       { templateUrl: 'views/user-create.html', controller: 'UserController', title: 'Create User' })
        .when('/user/edit/:id',     { templateUrl: 'views/user-edit.html', controller: 'UserController', title: 'Edit User' })                                                                             
        .when('/user/view/:id',     { templateUrl: 'views/user-view.html', controller: 'UserController', title: 'View User' })           
        .otherwise({ redirectTo:'/' });
        
    // Removes the # in urls
    $locationProvider.html5Mode(true);    
        
});


// Run
app.run(function($rootScope, $route, applicationName) {

    $rootScope.applicationName = applicationName;
    
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = $route.current.title;
    });    
    
});