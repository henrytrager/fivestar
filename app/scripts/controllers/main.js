'use strict';

angular.module('fivestarApp')
.controller('MainCtrl', function ($scope, Search, debounce) {
    $scope.index = 'aps';
    $scope.query = '';

    $scope.$watch('query', $scope.updateSearch);
    $scope.$watch('index', $scope.updateSearch);

    $scope.updateSearch = debounce(400, function() {
        $scope.results = Search.query({query: $scope.query, index:$scope.index});
    });
});
