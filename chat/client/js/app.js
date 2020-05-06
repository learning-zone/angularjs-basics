'use strict';
const app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

/*
* configuring our routes for the app
*/
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl: '/views/pages/auth.html',
            controller: 'authController'
        })
        .when('/home/:userId', {
            templateUrl: '/views/pages/home.html',
            controller: 'homeController'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

app.factory('appService', ($http) => {
    return new AppService($http)
});
