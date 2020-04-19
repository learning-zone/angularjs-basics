
import * as angular from 'angular';

class ObjectCtrl {
    
    constructor(private $scope: any) {    
          
    }

    initHeaders() {
        return [
          {
            contentField : 'date',
            contentFilter: {
              filter : 'date',
              pattern: 'dd/MM/yyyy'
            },
            contentType  : 'text',
            label        : 'Date',
            sortableField: true
          }, {
            contentField : 'label',
            contentFilter: {
              filter: 'uppercase'
            },
            contentType  : 'text',
            label        : 'Label',
            sortableField: true
          }, {
            contentField : 'amount',
            contentType  : 'input',
            label        : 'Amount',
            sortableField: true
          }
        ];
    }

    initContent() {
        return [
          {
            amount: 10.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 1'
          }, {
            amount: 20.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 2'
          }, {
            amount: 90.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 3'
          }, {
            amount: 60.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 4'
          }, {
            amount: 70.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 5'
          }, {
            amount: 30.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 6'
          }, {
            amount: 50.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 7'
          }, {
            amount: 80.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 8'
          }, {
            amount: 5.0,
            date  : new Date().getMilliseconds(),
            label : 'Task 9'
          }
        ];
    }
}

export default {
    bindings: { text: "@" }, /** Reading an attribute as text **/
    templateUrl: require("./object.html"),
    controller: ObjectCtrl
}