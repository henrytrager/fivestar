'use strict';

angular.module('fivestarApp')
.controller('MainCtrl', function ($scope, Search, debounce) {
    $scope.index = 'none';
    $scope.query = '';

    $scope.updateSearch = debounce(400, function() {
        if ($scope.query.length <= 0) {
            return;
        }
        if ($scope.index === 'none') {
            // alert or something to show them they need to select a thing
            return;
        }
        $scope.results = Search.query({query: $scope.query, index:$scope.index});
    });

    $scope.$watch('query', $scope.updateSearch);
    $scope.$watch('index', $scope.updateSearch);
});
