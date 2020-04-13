'use strict';

var Menu    = require('../components/Menu.js');
var Share = require('../components/Share.js');
var BottomSheetInstance = require('../components/BottomSheetInstance.js');

describe('my app', function() {

  var menu   = new Menu();
  var share = new Share();
  var sheet = new BottomSheetInstance();

  beforeEach(function() {
    menu.loadAbout();
  });

  it('should load all 3 menu items', function() {
    expect(menu.countNavLinks()).toBeGreaterThan(2);
  });

  it('should have the header ripple attached', function() {
    expect(menu.rippleAttached()).toBeTruthy();
  });

  describe('selecting a user', function() {

    beforeEach(function() {
      return share.clickContact();
    });

    it('should set focus on first button in the bottomsheet view', function() {
      expect( sheet.buttons().count() ).toBe(4);
      expect( sheet.buttons().first().getText() ).toEqual( 'PHONE' );
      expect( sheet.focusedButton().getText() ).toEqual( 'PHONE' );
    });

  });
});
