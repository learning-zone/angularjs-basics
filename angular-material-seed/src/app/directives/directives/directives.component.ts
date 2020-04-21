
import * as angular from 'angular';

class DirectivesCtrl {
    
    constructor(private $scope: any) { }
}

export default {
    bindings: { title: "=" },
    templateUrl: require("./directives.html"),
    controller: DirectivesCtrl
}