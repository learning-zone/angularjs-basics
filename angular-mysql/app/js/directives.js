'use strict';

// Directives

var app = angular.module('myApp.directives', []);


/*
    Adds copyright year, e.g.
    <p copyright>Company</p> 
*/
app.directive('copyright', function() {
    
    return function(scope, elm, attrs) {
    
        var year = new Date().getFullYear();        
        elm.prepend('&copy; ' + year + ' ');
    };
});