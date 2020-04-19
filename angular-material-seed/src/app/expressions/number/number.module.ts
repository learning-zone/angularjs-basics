import * as angular from 'angular';

import { routes } from './number.routes';
import numberComponent from './number.component';
import { NumberService } from './number.service';

export default angular.module('number', [])
    .config(routes)
    .component("number", numberComponent)
    .service('numberService', NumberService)
    .name;