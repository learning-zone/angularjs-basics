export function routes($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state({ name: 'home', url: '/', component: 'home' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];