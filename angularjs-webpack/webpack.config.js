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
