'use strict';

angular.module('appApp')
  .directive('controls', [ 
    '$mdSidenav',
    'configuration',
    '$rootScope',
    '_',
    'dataService',
    function ($mdSidenav, conf, $rootScope, _, ds) {
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
            var resp = ds.filter(resource);
            scope.languages = resp.languages;
            scope.countries = resp.countries;
          };

      }
    };
  }]);
