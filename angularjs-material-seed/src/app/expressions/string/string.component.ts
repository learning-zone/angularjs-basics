
import * as angular from 'angular';

class StringCtrl {
    
    constructor(private $scope: any) {    

    }

    getResult() {
        this.$scope.result = 'You full name is: ' +this.$scope.user.firstName + ' ' +this.$scope.user.lastName;
    }
}

export default {
    bindings: { text: "@" }, /** Reading an attribute as text **/
    templateUrl: require("./string.html"),
    controller: StringCtrl
}