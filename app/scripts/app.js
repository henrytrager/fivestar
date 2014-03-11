'use strict';

angular.module('fivestarApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'rt.debounce'
])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        reloadOnSearch: false
    })
    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
})
.factory('nx', function() {
    return window.nx;
});