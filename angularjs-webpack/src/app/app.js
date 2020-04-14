import angular from 'angular';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

function AppCtrl($scope) {

  $scope.sections = [
      {name: 'Home',  value:'home'},
      {name: 'About', value:'about'},
      {name: 'Contact', value:'contact'}];

  $scope.setMaster = function(section) {
      $scope.selected = section;
  }

  $scope.isSelected = function(section) {
      return $scope.selected === section;
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [require("angular-route")])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .config(function($routeProvider) {
    $routeProvider
    .when("/home", {
      templateUrl : "components/red.html"
    })
    .when("/about", {
      templateUrl : "components/green.html"
    })
    .when("/contact", {
      templateUrl : "components/yellow.html"
    });
  });

export default MODULE_NAME;