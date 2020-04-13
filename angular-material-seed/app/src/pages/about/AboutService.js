(function(){
  'use strict';

  angular.module('about')
         .service('aboutService', ['$q', AboutService]);

  /**
   * About DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function}}
   * @constructor
   */
  function AboutService($q){
    var data = {
      title: 'Hello Material World',
      description: 'This is a ready-to-use AngularJS starter app based on Google Material Design. It uses Angular Material components. If you want to edit this text, it is currently hardcoded in the AboutService.js file, simulating an async load.'
    };

    // Promise-based API
    return {
      loadContent : function() {
        // Simulate async nature of real remote calls
        return $q.when(data);
      }
    };
  }

})();
