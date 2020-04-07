import angular from 'angular';
import './main/main.module';

var mainApp = angular.module('mainApp', ['mainModule']);
mainApp.controller('appController',  ['$scope', function ($scope) {
    $scope.title ='AngularJS with Webpack';
}]
)
