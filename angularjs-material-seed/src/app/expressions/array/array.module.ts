import * as angular from 'angular';

import { routes } from './array.routes';
import arrayComponent from './array.component';
import { ArrayService } from './array.service';

export default angular.module('array', [])
    .config(routes)
    .component("array", arrayComponent)
    .service('arrayService', ArrayService)
    .name;