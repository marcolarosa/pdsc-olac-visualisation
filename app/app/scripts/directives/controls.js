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
          languages: '=',
          countries: '='
      },
      link: function postLink(scope) {
          scope.resourceTypes = ds.datasets.resourceTypes;

          scope.filter = function(resource) {
              $timeout(function() {
                  var resp = ds.filter(resource);
                  scope.languages = resp.languages;
                  scope.countries = resp.countries;
              }, 200);
          };

      }
    };
  }]);
