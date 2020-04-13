var Menu = function() {
  this.loadAbout = function() {
    browser.get('/#/about');
  };

  this.countNavLinks = function() {
    return element.all(by.css('.menu .md-button')).count();
  };

  this.rippleAttached = function() {
  	return element.all(by.css('.md-toolbar.md-ink-ripple')).count() ? true : false;
  }
};

module.exports = Menu;

