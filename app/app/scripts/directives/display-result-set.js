'use strict';

angular.module('appApp')
  .directive('displayResultSet', [ 
    'dataService',
    function (ds) {
    return {
      templateUrl: 'views/display-result-set.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope) {
      }
    };
  }]);
