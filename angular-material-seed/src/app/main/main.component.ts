class MainCtrl {
    constructor(
        private $scope: ng.IScope,
        private $mdSidenav: ng.material.ISidenavService,
        private $location: ng.ILocationService
    ) {
        this.$scope.$on('update-theme', (event, args) => {
            this.currentTheme = args;
        });
    }

    $onInit() { }

    currentTheme = "blue";
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
        this.$mdSidenav("left").close();
        this.$location.path(link);
    }
}

MainCtrl.$inject = ["$scope", "$mdSidenav", "$location"];

export default {
    bindings: { title: "=" },
    templateUrl: require("./main.html"),
    controller: MainCtrl
}