'use strict';

angular.module('appApp')
  .directive('controls', [ 
    'dataService',
    '$timeout', 
    function (ds, $timeout) {
    return {
      templateUrl: 'views/controls.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope) {
          scope.resourceTypes = ds.datasets.resourceTypes;

          scope.filter = function(resource) {
              $timeout(function() {
                  ds.filter(resource);
              }, 200);
          };

      }
    };
  }]);
