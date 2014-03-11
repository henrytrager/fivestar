'use strict';

angular.module('fivestarApp')
.controller('MainCtrl', function ($scope, Search, debounce, $routeParams, $location, nx) {


    $scope.index = $routeParams.index || 'All';
    $scope.query = $routeParams.query || '';
    $scope.node = $routeParams.node || undefined;
    $scope.brand = $routeParams.brand || undefined;

    $scope.didGetFirst = false;
    $scope.loading = false;

    $scope.initURLChange = nx.once(function() {
        $scope.$on('$routeChangeSuccess', function() {
            $scope.getData();
        });
    });

    $scope.updateURL = function(clearOthers) {
        if ($scope.didGetFirst) {
            clearOthers = clearOthers === true ? true : false;
            $scope.node = clearOthers ? undefined : $scope.node;
            $scope.brand = clearOthers ? undefined : $scope.brand;
        }

        $location.search('query', $scope.query);
        $location.search('index', $scope.index);
        $location.search('node', $scope.node);
        $location.search('brand', $scope.brand);
        $scope.getData();
    };

    $scope.getData = debounce(400, function() {
        $scope.didGetFirst = true;
        $scope.loading = true;
        $scope.err = undefined;
        if ($scope.query.length <= 0) {
            $scope.loading = false;
            $scope.err = 'Please search for a Keyword.';
            return;
        }
        if ($scope.index === 'All') {
            // alert or something to show them they need to select a thing
            $scope.loading = false;
            $scope.err = 'Please choose a Department';
            return;
        }
        $scope.results = undefined;
        $scope.results = Search.get({
            query: $scope.query,
            index: $scope.index,
            node: $scope.node,
            brand: $scope.brand
        });

        $scope.initURLChange();
    });


    $scope.$watch('query', $scope.updateURL);
    $scope.$watch('index', function() {
        $scope.updateURL(true);
    });
    $scope.$watch('node', $scope.updateURL);
    $scope.$watch('brand', $scope.updateURL);


    // NODE
    $scope.selectBin = function(bin) {
        if (bin.Name === 'Brand') {
            $scope.brand = bin.Value;
        } else if (bin.Name === 'BrowseNode') {
            $scope.node = bin.Value;
        }
    };

    $scope.isBin = function(bin) {
        if (bin === 'BrandName') {
            return $scope.brand !== undefined;
        } else if (['Categories', 'Subject'].indexOf(bin) !== -1) {
            return $scope.node !== undefined;
        }
    };

    $scope.clearBin = function(bin) {
        if (bin === 'BrandName') {
            $scope.brand = undefined;
        } else if (['Categories', 'Subject'].indexOf(bin) !== -1) {
            $scope.node = undefined;
        }
    };
});
