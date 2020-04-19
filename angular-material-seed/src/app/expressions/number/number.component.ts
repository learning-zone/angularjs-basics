
import * as angular from 'angular';

class NumberCtrl {
    
    constructor(private $scope: any) {    

    }

    getResult() {
        this.$scope.result = 'Total is: '+this.$scope.user.number1 + this.$scope.user.number2;
    }
}

export default {
    bindings: { title: "=" },
    templateUrl: require("./number.html"),
    controller: NumberCtrl
}