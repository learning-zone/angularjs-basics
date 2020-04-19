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
          title: 'Components',
          icon: 'history',
          active: false,
          type: 'dropdown',
          submenus: [
            {
              title: 'Component - 1',
              icon: 'history',
              path: 'home'
            },
            {
              title: 'Components - 2',
              icon: 'history',
              path: 'settings'
            },
            {
              title: 'Components - 3',
              icon: 'history',
              path: 'home'
            }
          ]
        },
        {
          title: 'Forms',
          icon: 'settings',
          active: false,
          type: 'dropdown',
          submenus: [
            {
              title: 'Forms - 1',
              icon: 'settings',
              path: 'settings'
            },
            {
              title: 'Forms - 2',
              icon: 'settings',
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