import * as angular from 'angular';

import { routes } from './string.routes';
import stringComponent from './string.component';
import { StringService } from './string.service';

export default angular.module('string', [])
    .config(routes)
    .component("string", stringComponent)
    .service('stringService', StringService)
    .name;