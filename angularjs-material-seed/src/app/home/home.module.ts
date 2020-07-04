import * as angular from 'angular';

import { routes } from './home.routes';

import homeComponent from './home.component';
import { HomeService } from './home.service';

export default angular.module('home', [])
    .config(routes)
    .component("home", homeComponent)
    .service('homeService', HomeService)
    .name;