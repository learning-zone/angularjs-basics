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
              icon: 'settings_ethernet',
              path: 'number'
            },
            {
              title: 'String Expressions',
              icon: 'settings_ethernet',
              path: 'string'
            },
            {
              title: 'Object Expressions',
              icon: 'settings_ethernet',
              path: 'object'
            },
            {
                title: 'Array Expressions',
                icon: 'settings_ethernet',
                path: 'array'
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
              title: 'Directives',
              icon: 'settings_ethernet',
              path: 'directives'
            }
          ]
        }
      ];
    
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