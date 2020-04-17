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
    menu = [
        { link: "home", title: "Home", icon: "home" },
        { link: "settings", title: "Settings", icon: "settings" }
    ];

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

MainCtrl.$inject = ["$scope", "$mdSidenav", "$location"];

export default {
    bindings: { title: "=" },
    templateUrl: require("./main.html"),
    controller: MainCtrl
}