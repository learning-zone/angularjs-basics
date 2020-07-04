export function routes($urlRouterProvider, $stateProvider) {
    $stateProvider.state({ name: 'object', url: '/object', component: 'object' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];