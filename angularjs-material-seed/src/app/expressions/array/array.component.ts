
import * as angular from 'angular';

class ArrayCtrl {
    
    constructor(private $scope: any) {    
          
    }

}

export default {
    bindings: { text: "@" }, /** Reading an attribute as text **/
    templateUrl: require("./array.html"),
    controller: ArrayCtrl
}