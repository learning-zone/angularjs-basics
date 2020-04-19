export function routes($urlRouterProvider, $stateProvider) {
    $stateProvider.state({ name: 'number', url: '/number', component: 'number' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];