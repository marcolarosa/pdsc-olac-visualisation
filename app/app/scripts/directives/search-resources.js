'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:searchResources
 * @description
 * # searchResources
 */
angular.module('appApp')
  .directive('searchResources', [ '_', function (_) {
    return {
      templateUrl: 'views/search-resources.html',
      restrict: 'E',
      scope: {
          resources: '=',
          searchResults: '='
      },
      link: function postLink(scope) {
          scope.originalResources = scope.resources;

          scope.search = function() {
              if (scope.what.length < 3) {
                  scope.searchResults = scope.originalResources;
              } else if (scope.what.length > 2) {
                  scope.searchResults = _.compact(_.map(scope.originalResources, function(r) {
                      var re = new RegExp(scope.what, 'im');
                      var result = r.text.search(re);
                      if (result !== -1) {
                          return r;
                      }
                  }));
              }
          };

          scope.reset = function() {
              delete scope.what;
              scope.searchResults = scope.originalResources;
          };
      }
    };
  }]);
