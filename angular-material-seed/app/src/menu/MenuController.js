(function(){

  angular
       .module('menu')
       .controller('MenuController', [
          'menuService', '$location', '$mdSidenav', '$mdBottomSheet', '$mdInkRipple', '$log', '$q',
          MenuController
       ]);

  /**
   * Menu Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MenuController( menuService, $location, $mdSidenav, $mdBottomSheet, $mdInkRipple, $log, $q) {
    var self = this;
    var currentPage = $location.path();

    self.menuItems        = [ ];
    self.setActiveMenu  = setActiveMenu;
    self.toggleView = toggleView;

    // Load all menu items

    menuService
          .loadMenu()
          .then( function( menuItems ) {
            self.menuItems    = [].concat(menuItems);

            $mdInkRipple.attach(self, angular.element(document.getElementById('header-toolbar')), {
              center: false,
              dimBackground: false
            });
            
            if (currentPage && currentPage !== '/') {
              angular.forEach(menuItems, function(menuItem) {
                if (menuItem.href.indexOf(currentPage) !== -1) {
                  setActiveMenu(menuItem);
                }
              });
            } else {
              setActiveMenu(menuItems[0]);
            }
          });

    // *********************************
    // Internal methods
    // *********************************

    function setActiveMenu(menuItem, toggleMenu) {
      self.selected = menuItem;
      self.headerColor = menuItem.colorHex;
      if (toggleMenu) {
        toggleView();
      }
    }

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleView() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }
  }

})();
