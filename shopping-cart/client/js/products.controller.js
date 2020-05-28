'user strict';

// File Upload Directive
app.directive('fileModel', ['$parse', function ($parse) {
  return {
     restrict: 'A',
     link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
           scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
           });
        });
     }
  };
}]);

// File Upload Service
app.service('multipartForm', ['$http', function ($http) {
  this.post = function(uploadUrl, data) {
    var fd = new FormData();
    for(var key in data) {
      fd.append(key, data[key]);
    }
     
    $http.post(uploadUrl, fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    }).then(function (httpResponse) {
       console.log('multipartForm Response:', httpResponse);
    });
  }
}]);

app.controller('productsController', function ($http, $mdEditDialog, $q, $timeout, $scope, multipartForm){

  $scope.options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true
  };

  $scope.IsVisible = false;
  $scope.selected = [];
  $scope.product = {};
  $scope.limitOptions = [5, 10, 15, {
    label: 'All',
    value: function () {
      return $scope.products ? $scope.products.count : 0;
    }
  }];

  $scope.query = {
    order: 'product_name',
    limit: 10,
    page: 1
  };

  $http.post('/getProducts').then(function (products) {
    $scope.products = products.data;
    console.log($scope.products);
  });

  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
  };

  $scope.onPaginate = function(page, limit) {
    console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
    console.log('Page: ' + page + ' Limit: ' + limit);

    $scope.promise = $timeout(function () {

    }, 2000);
  };

  $scope.deselect = function (item) {
    console.log(item.name, 'was deselected');
  };

  $scope.log = function (item) {
    console.log(item.name, 'was selected');
  };

  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {

    }, 2000);
  };

  $scope.onReorder = function(order) {

    console.log('Scope Order: ' + $scope.query.order);
    console.log('Order: ' + order);

    $scope.promise = $timeout(function () {

    }, 2000);
  };

  $scope.addProduct = function() {
    $scope.IsVisible = $scope.IsVisible ? false : true;
  }
    
  // Image Preview
  $scope.SelectFile = function (e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        $scope.PreviewImage = e.target.result;
        $scope.$apply();
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  // Add Product
  $scope.submit= function(){

    // File Upload Service
    const uploadUrl = "/addProducts";
    multipartForm.post(uploadUrl, $scope.product);
  }  

});