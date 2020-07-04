
import * as angular from 'angular';

class NumberCtrl {
    sum = 0;
    constructor(private $scope: any) {    

    }

    getResult() {
         this.sum = this.$scope.user.number1 + this.$scope.user.number2;
         this.$scope.result = "Total is: "+ this.sum;
    }
}

export default {
    bindings: { title: "=" },
    templateUrl: require("./number.html"),
    controller: NumberCtrl
}