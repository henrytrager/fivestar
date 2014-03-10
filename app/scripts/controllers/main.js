'use strict';

angular.module('fivestarApp')
.controller('MainCtrl', function ($scope, Search, debounce, $routeParams) {
    $scope.index = $routeParams.index || 'none';
    $scope.query = $routeParams.query || '';
    $scope.node = $routeParams.node || undefined;
    $scope.brand = $routeParams.brand || undefined;

    $scope.updateSearch = debounce(400, function() {
        if ($scope.query.length <= 0) {
            return;
        }
        if ($scope.index === 'none') {
            // alert or something to show them they need to select a thing
            return;
        }
        $scope.results = Search.query({
            query: $scope.query,
            index:$scope.index,
            node: $scope.node,
            brand: $scope.brand
        });
    });

    $scope.$watch('query', $scope.updateSearch);
    $scope.$watch('index', $scope.updateSearch);
});
