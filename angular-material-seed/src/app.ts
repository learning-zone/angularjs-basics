import * as angular from 'angular';
import * as ngAnimate from 'angular-animate';
import * as ngAria from 'angular-aria';
import * as ngMaterial from 'angular-material';
import * as uiRouter from '@uirouter/angularjs';
import { routes } from './app.routes';
import 'angular-material/angular-material.scss';
import 'hammerjs';
import * as hmTouchEvents from 'angular-hammer';

import './style.scss';

import mainModule from './app/main/main.module';
import settingsModule from './app/settings/settings.module';
import homeModule from './app/home/home.module';
import numberModule from './app/expressions/number/number.module';
import objectModule from './app/expressions/object/object.module';
import stringModule from './app/expressions/string/string.module';
import arrayModule from './app/expressions/array/array.module';
import directivesModule from './app/directives/directives/directives.module';


angular.module("app", [
    uiRouter.default, 
    ngAnimate, ngAria, 
    ngMaterial, 
    hmTouchEvents, 
    mainModule, 
    settingsModule, 
    homeModule,
    numberModule,
    stringModule,
    objectModule,
    arrayModule,
    directivesModule
]);
angular.module("app").config(routes);

angular.module("app").config(["$mdThemingProvider", function ($mdThemingProvider) {
    $mdThemingProvider.theme("blue")
        .primaryPalette("blue")
        .accentPalette("red");

    $mdThemingProvider.theme("green")
        .primaryPalette("teal")
        .accentPalette("red");

    $mdThemingProvider.alwaysWatchTheme(true);
}]);

//https://docs.angularjs.org/guide/production
angular.module("app").config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
}]);

angular.bootstrap(document, ["app"]);

//https://github.com/vsternbach/angularjs-typescript-webpack
//http://ryanmullins.github.io/angular-hammer/