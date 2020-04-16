export function routes($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}
routes.$inject = ['$urlRouterProvider'];