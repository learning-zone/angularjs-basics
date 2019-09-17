'use strict';

// Controllers

var app = angular.module('myApp.controllers', [
    'ng',
    'ngResource',   
    'myApp.services'    
]);


// Controller for root page
app.controller('IndexController', function($http, $scope, applicationName) {
       
    $scope.applicationName = applicationName; 
    
    // For some reason $resource won't work here, so went for $http.get()
    $http.get('/api/users')
        .success(
            function(data, status, headers, config) {
            
                $scope.users = data;
            })
        .error(
            function(data, status, headers, config) {
            
                $scope.status = status;
            });       
});

// Controller for Users page
app.controller('UsersController', function($resource, $scope, $location, $route) {  

    var Users = $resource('/api/users'); 

    // Get Users from API
    $scope.users = Users.query();
    
    // Delete a User then relaod view
    $scope.deleteUser = function(userId) {
        
        var User = $resource('/api/users/:id', { id: userId });    
    
        User.delete( 
            function() {
                // success  
                $route.reload();             
            },
            function(error) {
                // error
                console.log(error);
            }
        );
    }    

});

// Controller for User pages
app.controller('UserController', function($routeParams, $resource, $scope, $location, $window) {   

    var userId = $routeParams.id;
    
    if (userId) {
        var User = $resource('/api/users/:id', { id: userId });
        
        // Get User from API
        $scope.user = User.get();
    }   
    
    // Create a User
    $scope.createUser = function() {
    
        var Users = $resource('/api/users');       
    
        if ($scope.userForm.$valid) {
            Users.save($scope.user, 
                function() {
                    // success
                    $location.path('/users');                     
                },
                function(error) {
                    // error
                    console.log(error);
                }               
            );
        }      
    }
    
    // Update User details
    $scope.updateUser = function() {
    
        var User = $resource('/api/users/:id', { id: userId }, { update: { method:'PUT' } });    
    
        if ($scope.userForm.$valid) {
            User.update($scope.user, 
                function() {
                    // success
                    $location.path('/users');                     
                },
                function(error) {
                    // error
                    console.log(error);
                }
            );
        }
    }
    
    // Delete a User
    $scope.deleteUser = function(userId) {
        
        var User = $resource('/api/users/:id', { id: userId });    
    
        User.delete( 
            function() {
                // success
                $location.path('/users');                     
            },
            function(error) {
                // error
                console.log(error);
            }
        );
    }
    
    // Go back in history
    $scope.goBack = function() {
    
        $window.history.back();
    };       
    
});