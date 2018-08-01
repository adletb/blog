angular.module("ppp", ['ui.router']).config(routeConfig);

routeConfig.$inject =
['$stateProvider', '$locationProvider', '$urlRouterProvider'];

function  routeConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');//Если нет страницы редирект на страницу root

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "views/home.html",

        })
        .state('profile', {
            url: '/profile',
            templateUrl: "views/profile.html",
            controller: "ProfileCtrl",
            controllerAs: "vm"
        })
        .state('singlePost', {
            url: '/singlePost/:id',
            templateUrl: "views/singlpost.html",
            controller: "SinglePostCtrl",
            controllerAs: "vm"
        })
}
