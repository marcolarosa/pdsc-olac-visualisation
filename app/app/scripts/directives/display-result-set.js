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
          scope.languages = ds.datasets.filtered.languages.slice(0,10);
          scope.$on('dataset filtered', function() {
              scope.languages = ds.datasets.filtered.languages.slice(0,10);
          }, true);
      }
    };
  }]);
