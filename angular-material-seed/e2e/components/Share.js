var Share = function() {
  this.load = function() { browser.get('/#'); };

  this.clickContact = function() {
    $('button.contact').click();
  };

};

module.exports = Share;

