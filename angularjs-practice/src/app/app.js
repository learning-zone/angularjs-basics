import angular from 'angular';
var mainApp = angular.module('mainApp', []);
mainApp.controller('appController',  ['$scope', function ($scope) {
    $scope.title ='Hello Angular';
}]
)
