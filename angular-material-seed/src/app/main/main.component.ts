import * as angular from 'angular';

class MainCtrl {
    
    constructor(
        private $scope: ng.IScope,
        private $mdSidenav: ng.material.ISidenavService,
        private $location: ng.ILocationService
    ) {
        this.$scope.$on('update-theme', (event, args) => {
            this.currentTheme = args;
        });

        this.$scope.$on('$viewContentLoaded', () => { 
            document.getElementById('pages').classList.add('pages-sidenav');
            this.openNav();
        });
    }
    $onInit() { 
    }

    currentTheme = "green";
    menus = [
        {
          title: 'Expressions',
          icon: 'list',
          active: false,
          type: 'dropdown',
          submenus: [
            {
              title: 'Number Expressions',
              icon: 'code',
              path: 'number'
            },
            {
              title: 'String Expression',
              icon: 'code',
              path: 'settings'
            },
            {
              title: 'Object Expressions',
              icon: 'code',
              path: 'home'
            },
            {
                title: 'Array Expressions',
                icon: 'code',
                path: 'home'
              }
          ]
        },
        {
          title: 'Directives',
          icon: 'list',
          active: false,
          type: 'dropdown',
          submenus: [
            {
              title: 'ng-app',
              icon: 'code',
              path: 'settings'
            },
            {
              title: 'ng-init',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-model',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-repeat',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-bind',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-show',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-switch',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-if',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-include',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-cloak',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-view',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'ng-template',
              icon: 'code',
              path: 'home'
            },
            {
              title: 'Custom Directive',
              icon: 'code',
              path: 'home'
            }
          ]
        }
      ];
    /*/menu = [
        { link: "home", title: "Home", icon: "home" },
        { link: "settings", title: "Settings", icon: "settings" }
    ];*/
    
    sideNav() { 
        document.getElementById('pages').classList.toggle('pages-sidenav');
    }
    
    toggleNav() {  
        this.$mdSidenav("left").toggle();
    }

    openNav() {
        this.$mdSidenav("left").open();
    }

    closeNav() {
        this.$mdSidenav("left").close();
    }

    goTo(link: string) {
        this.$mdSidenav("left").open();
        this.$location.path(link);
    }
}

MainCtrl.$inject = ["$scope", "$mdSidenav", "$location", "$mdComponentRegistry", "$log", "$mdMedia", "$timeout"];

export default {
    bindings: { title: "=" },
    templateUrl: require("./main.html"),
    controller: MainCtrl
}