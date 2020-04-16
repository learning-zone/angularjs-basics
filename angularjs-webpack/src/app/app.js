import angular from 'angular';
import ngRoute from 'angular-route';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

function AppCtrl($scope) {


  $scope.menus = [
    {
      title: "Menu1", 
      action: "home", 
      menus: [
        {
          title: "Submenu 1a",
          action: "stuff"
        },
        {
          title: "Submenu 1b",
          action: "moreStuff",
          menus: [
            {
              title: "Submenu 1b 1",
              action: "stuff"
            },
            {
              title: "Submenu 1b 2",
              action: "moreStuff"
            }
          ]
        }
      ]
    },
    {
      title: "Menu2", 
      action: "about", 
      menus: [
        {
          title: "Submenu 2a",
          action: "awesomeStuff"
        },
        {
          title: "Submenu 2b",
          action: "moreAwesomeStuff"
        }
      ]
    }
  ];

  $scope.setMaster = function(section) {
      $scope.selected = section;
  }

  $scope.isSelected = function(section) {
      return $scope.selected === section;
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngRoute', 'ngMessages'])
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
    })
    .otherwise({
      templateUrl : "components/red.html"
    });
  });

export default MODULE_NAME;