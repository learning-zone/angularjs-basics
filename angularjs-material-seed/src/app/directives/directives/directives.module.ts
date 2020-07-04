import * as angular from 'angular';

import { routes } from './directives.routes';
import directivesComponent from './directives.component';
import { DirectivesService } from './directives.service';

export default angular.module('ng-app', [])
    .config(routes)
    .component("directives", directivesComponent)
    .service('directivesService', DirectivesService)
    .name;