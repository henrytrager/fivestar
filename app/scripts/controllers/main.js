'use strict';

angular.module('fivestarApp')
.controller('MainCtrl', function ($scope, Search, debounce, $routeParams, $location) {

    $scope.loading = false;

    $scope.updateURL = function() {
        $location.search('query', $scope.query);
        $location.search('index', $scope.index);
        $location.search('node', $scope.node);
        $location.search('brand', $scope.brand);
        $scope.getData();
    };

    $scope.getData = debounce(400, function() {
        $scope.results = undefined;
        $scope.loading = true;
        if ($scope.query.length <= 0) {
            $scope.loading = false;
            return;
        }
        if ($scope.index === 'none') {
            // alert or something to show them they need to select a thing
            $scope.loading = false;
            return;
        }
        $scope.results = Search.get({
            query: $scope.query,
            index: $scope.index,
            node: $scope.node,
            brand: $scope.brand
        });
    });

    $scope.$on('$routeChangeSuccess', $scope.getData);

    $scope.$watch('query', $scope.updateURL);
    $scope.$watch('index', $scope.updateURL);
    $scope.$watch('node', $scope.updateURL);
    $scope.$watch('brand', $scope.updateURL);

    $scope.index = $routeParams.index || 'none';
    $scope.query = $routeParams.query || '';
    $scope.node = $routeParams.node || undefined;
    $scope.brand = $routeParams.brand || undefined;


    // NODE
    $scope.isSelectedNode = function() {

    };

    $scope.selectBin = function(params) {
        if (params.Name === 'Brand') {
            $scope.brand = params.Value;
        } else if (params.Name === 'BrowseNode') {
            $scope.node = params.Value;
        }


    };
});
