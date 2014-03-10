'use strict';

angular.module('fivestarApp')
.directive('searchheader', function () {
    return {
        templateUrl: 'views/partials/searchheader.html',
        restrict: 'AE',
        scope: {
            'query': '='
        },
        link: function postLink(scope, element) {

        }
    };
});
