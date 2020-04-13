(function(){
  'use strict';

  angular.module('about')
         .config(['$routeProvider', '$locationProvider', AboutRoutes]);

  function AboutRoutes($routeProvider, $locationProvider, $q){
    $routeProvider
      .when('/about', {
        templateUrl: '/src/pages/about/view/content.html',
        controller: 'AboutController',
        controllerAs: 'page'
      })
      .when('/', {
        templateUrl: '/src/pages/about/view/content.html',
        controller: 'AboutController',
        controllerAs: 'page'
      });
  }

})();
