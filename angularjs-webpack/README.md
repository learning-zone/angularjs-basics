## AngularJS with Webpack 



### Project Description

This Projects describe about AngularJS configuration with Webpack and SCSS library.


### Configuration Steps

**1. Generate package.json**  
```
npm init -y
```
This will create a package.json file.
```json
{
  "name": "webpackAndAngularJS",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**2. Install Dependencies**  
```
npm install angular --save
npm install webpack --save-dev
npm install webpack-dev-server --save-dev
npm install webpack-cli --save-dev
npm install html-webpack-plugin --save-dev
npm install rimraf --save-dev
```
Now `package.json` will look like below
```
{
  "name": "angularjs-webpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rimraf dist && webpack --bail --progress --profile",
    "server": "webpack-dev-server --history-api-fallback --inline --progress --open --watch",
    "start": "npm run server"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "angular": "^1.7.9",
    "fibers": "^4.0.2",
    "sass": "^1.26.3"
  },
  "devDependencies": {
    "css-loader": "^3.5.1",
    "html-loader": "^1.1.0",
    "html-webpack-plugin": "^4.0.4",
    "node-sass": "^4.13.1",
    "rimraf": "^3.0.2",
    "sass-loader": "^8.0.2",
    "style-loader": "^1.1.3",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  }
}
```
**3. Generate webpack.config.js**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
  entry: './src/app/app.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
   rules: [{ 
      test: /\.(html)$/, 
      use: [
        { loader:'html-loader'}
      ]
   },
   { 
    test: /\.(scss)$/, 
    use: [
      { loader:'style-loader'},
      { loader:'css-loader'},
      { loader:'sass-loader'}
    ]
   }
  ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

### Development Server

Run `npm start` for a dev server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

### Build

Run `npm run-script build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


### Resources

*   [Bootstrap](https://getbootstrap.com/)
*   [Font awsome](http://fontawesome.io/)
*   [AngularJS](https://angularjs.org/)
*   [Webpack](https://webpack.js.org/)
*   [SCSS](https://sass-lang.com/)
*   [NodeJS](https://nodejs.org/en/)


### Further help

To get more help on the AngularJS use [AngularJS README](https://github.com/angular/angular.js/blob/master/README.md).
