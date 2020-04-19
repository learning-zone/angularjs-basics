export function routes($urlRouterProvider, $stateProvider) {
    $stateProvider.state({ name: 'string', url: '/string', component: 'string' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];