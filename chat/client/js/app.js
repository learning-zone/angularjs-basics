'use strict';

const app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial', 'md.data.table']);

/*
* Theme Settings
*/
app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    
    $mdThemingProvider.theme("green")
        .primaryPalette("teal")
        .accentPalette("red");
}]);

/*
* configuring our routes for the app
*/
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        // route for the home page
        
        .when('/home', {
            templateUrl: '/views/pages/home.html',
            controller: 'homeController'
        })
        .when('/products', {
            templateUrl: '/views/pages/products.html',
            controller: 'productsController'
        })
        .otherwise({
            redirectTo: '/home'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

app.factory('appService', ($http) => {
    return new AppService($http)
});
