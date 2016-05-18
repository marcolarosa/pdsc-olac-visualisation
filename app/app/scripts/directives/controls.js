'use strict';

angular.module('appApp')
  .directive('controls', [ 
    'dataService',
    '$timeout', 
    '_',
    '$location',
    function (ds, $timeout, _, $location) {
    return {
      templateUrl: 'views/controls.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope) {
          scope.resourceTypes = ds.datasets.resourceTypes;
          scope.countries = _.sortBy(ds.datasets.filtered.countries, 'name');
          scope.$on('dataset filtered', function() {
              scope.countries = _.sortBy(ds.datasets.filtered.countries, 'name');
          }, true);

          scope.filterByResource = function(resource) {
              $timeout(function() {
                  ds.filterByResource(resource);
              }, 200);
          };

          scope.filterByCountry = function(country) {
              $timeout(function() {
                  ds.filterByCountry(country);
              }, 200);
          };

          scope.jumpToMap = function() {
              var p = $location.path();
              $location.path(p.split('/analyse')[0]);
          };

      }
    };
  }]);
