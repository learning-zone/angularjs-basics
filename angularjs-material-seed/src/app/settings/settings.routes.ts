export function routes($urlRouterProvider, $stateProvider) {
    $stateProvider.state({ name: 'settings', url: '/settings', component: 'settings' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];