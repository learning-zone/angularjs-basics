import * as angular from 'angular';
import settingsComponent from './settings.component';
import { routes } from './settings.routes';

export default angular.module('settings', [])
    .config(routes)
    .component("settings", settingsComponent)
    .name; 