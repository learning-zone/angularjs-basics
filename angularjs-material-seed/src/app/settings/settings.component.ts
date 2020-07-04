class SettingsCtrl {
    static $inject = ['$rootScope'];
    constructor(private $rootScope: ng.IRootScopeService) {
    }

    theme: string = "green";
    themes: Array<string> = ["blue", "green"];

    updateTheme() {
        this.$rootScope.$broadcast("update-theme", this.theme);
    }
}

export default {
    bindings: {},
    templateUrl: require("./settings.html"),
    controller: SettingsCtrl
}