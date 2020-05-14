'use strict';

const app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngAria', 'md.data.table', 'ngMaterial']);

/*
* Theme Settings
*/
app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    'use strict';
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

app.config(
    function($mdIconProvider, $$mdSvgRegistry) {
        // Add default icons from angular material
        $mdIconProvider
            .icon('md-close', $$mdSvgRegistry.mdClose)
            .icon('md-menu', $$mdSvgRegistry.mdMenu)
            .icon('md-toggle-arrow', $$mdSvgRegistry.mdToggleArrow) ;
    }
);

app.factory('appService', ($http) => {
    return new AppService($http)
});
