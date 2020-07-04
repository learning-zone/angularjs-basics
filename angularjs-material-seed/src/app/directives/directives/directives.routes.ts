export function routes($urlRouterProvider, $stateProvider) {
    $stateProvider.state({ name: 'directives', url: '/directives', component: 'directives' });
}
routes.$inject = ['$urlRouterProvider', '$stateProvider'];