'use strict';

angular.module('fivestarApp')
  .filter('aPrice', function () {
    return function (input) {
      return 'aPrice filter: ' + input;
    };
  });
