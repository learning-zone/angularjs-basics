(function(){
  'use strict';

  angular.module('menu')
         .service('menuService', ['$q', MenuService]);

  /**
   * Menu DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadMenu: Function}}
   * @constructor
   */
  function MenuService($q){
    var menuItems = [
      {
        title: 'About',
        href: '#/about',
        colorHex: '21909E'
      },
      {
        title: 'Purpose',
        href: '#/purpose',
        colorHex: 'A53434'
      },
      {
        title: 'GitHub',
        href: 'http://github.com/ritenv/angular-material-seed',
        colorHex: 'A53434'
      }
      // {
      //   title: 'Purpose',
      //   href: '#/purpose',
      //   colorHex: '455A64'
      // },
      // {
      //   title: 'Technology',
      //   href: '#/technology',
      //   colorHex: '009688'
      // },
      // {
      //   title: 'Credits',
      //   href: '#/credits',
      //   colorHex: '455A64'
      // }
    ];

    // Promise-based API
    return {
      loadMenu : function() {
        // Simulate async nature of real remote calls
        return $q.when(menuItems);
      }
    };
  }

})();
