class Config{
	
	constructor(app){
		// Setting .html as the default template extension
		app.set('view engine', 'html');

		// Telling express where it can find the templates
		app.set('views', (__dirname + '/../views'));

		//Files 
		app.use(require('express').static(require('path').join('client')));

	}
}
module.exports = Config;