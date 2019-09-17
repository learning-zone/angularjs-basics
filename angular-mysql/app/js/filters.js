'use strict';

// Filters

var app = angular.module('myApp.filters', []);

// Format the page title using values defined in services
app.filter('title', [
    'applicationName',
    'separator', 
    function(applicationName, separator) {
    
        return function(text) {
        
            return applicationName + separator + text;
        }
    }
]);