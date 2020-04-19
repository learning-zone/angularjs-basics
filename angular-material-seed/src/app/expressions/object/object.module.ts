import * as angular from 'angular';

import { routes } from './object.routes';
import ObjectComponent from './object.component';
import { ObjectService } from './object.service';

export default angular.module('string', [])
    .config(routes)
    .component("object", ObjectComponent)
    .service('objectService', ObjectService)
    .name;