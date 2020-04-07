import mainComponent from './main.component';
require('./main.module.scss');

export default angular
 .module('mainModule', [])
 .component('mainComponent', mainComponent()).name;