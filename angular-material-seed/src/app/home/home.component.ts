
class HomeCtrl {
    static $inject = [];
    constructor() {
        this.test = "some binding";
    }

    test: string;

    testClick() {
        alert("you clicked the button")
    }

    folders = [
        { title: "list item 1", icon: "folder", updated: new Date('1/1/16') },
        { title: "list item 2", icon: "folder", updated: new Date('1/1/16') },
        { title: "list item 3", icon: "folder", updated: new Date('1/1/16') },
    ];
}

export default {
    bindings: {},
    templateUrl: require("./home.html"),
    controller: HomeCtrl
}