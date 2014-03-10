'use strict';

angular.module('fivestarApp')
.filter('aPrice', function () {
    return function (input) {
        if (input.maxPrice === 'max') {
            return '$' + (window.parseFloat(input.minPrice/100)).toFixed(2) + '+';
        }
        return '$' + (window.parseFloat(input.minPrice/100)).toFixed(2) + ' - ' + '$' + (window.parseFloat(input.maxPrice/100)).toFixed(2);
    };
});
