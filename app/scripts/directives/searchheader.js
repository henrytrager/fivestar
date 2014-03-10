'use strict';

angular.module('fivestarApp')
.directive('searchheader', function () {
    return {
        templateUrl: 'partials/searchheader.html',
        restrict: 'E',
        scope: {
            'query': '='
        },
        link: function postLink(scope, element) {
            element.text('this is the searchheader directive');
        }
    };
});
