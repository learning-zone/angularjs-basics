import * as angular from 'angular';

import { routes } from './object.routes';
import objectComponent from './object.component';
import { ObjectService } from './object.service';

export default angular.module('object', [])
    .config(routes)
    .component("object", objectComponent)
    .service('objectService', ObjectService)
    .name;