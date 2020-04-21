export function routes($urlRouterProvider, $stateProvider) {
    $stateProvider.state({ name: 'array', url: '/array', component: 'array' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];