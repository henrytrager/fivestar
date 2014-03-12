'use strict';

angular.module('fivestarApp')
.controller('MainCtrl', function ($scope, Search, debounce, $routeParams, $location, nx) {

    // grab any default values from the url
    $scope.index = $routeParams.index || 'All';
    $scope.query = $routeParams.query || '';
    $scope.node = $routeParams.node || undefined;
    $scope.brand = $routeParams.brand || undefined;

    // init booleans
    $scope.didGetFirst = false;
    $scope.loading = false;

    // the fn runs only once even if called multiple times
    // on route change (input changed), get new data
    $scope.initURLChange = nx.once(function() {
        $scope.$on('$routeChangeSuccess', function() {
            $scope.getData();
        });
    });

    // updates the url based on data change
    $scope.updateURL = function(clearOthers) {
        // optionally clear the more specific datas if the index (Dept) is changed
        if ($scope.didGetFirst) {
            clearOthers = clearOthers === true ? true : false;
            $scope.node = clearOthers ? undefined : $scope.node;
            $scope.brand = clearOthers ? undefined : $scope.brand;
        }

        $location.search('query', $scope.query);
        $location.search('index', $scope.index);
        $location.search('node', $scope.node);
        $location.search('brand', $scope.brand);
        // now get the new data
        $scope.getData();
    };

    // debounced getData accounts for getdata via url change OR routeChange
    $scope.getData = debounce(400, function() {
        $scope.didGetFirst = true;
        $scope.loading = true;
        $scope.err = undefined;

        // input checking
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
        // clear UI
        $scope.results = undefined;
        // get new data and populate UI
        $scope.results = Search.get({
            query: $scope.query,
            index: $scope.index,
            node: $scope.node,
            brand: $scope.brand
        });

        // this sets up the routeChange trigger
        // so that it doesn't clear arguments in the url before the first getData has been called
        $scope.initURLChange();
    });


    // watch input variables and update url on change
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

    // returns if this bin is being searched upon
    $scope.isBin = function(bin) {
        if (bin === 'BrandName') {
            return $scope.brand !== undefined;
        } else if (['Categories', 'Subject'].indexOf(bin) !== -1) {
            return $scope.node !== undefined;
        }
    };

    // clears variable and therefore reloads page and data
    $scope.clearBin = function(bin) {
        if (bin === 'BrandName') {
            $scope.brand = undefined;
        } else if (['Categories', 'Subject'].indexOf(bin) !== -1) {
            $scope.node = undefined;
        }
    };
});
