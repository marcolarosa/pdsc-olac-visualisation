'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:searchResources
 * @description
 * # searchResources
 */
angular.module('appApp')
  .directive('searchResources', function () {
    return {
      templateUrl: 'views/search-resources.html',
      restrict: 'E',
      scope: {
          resources: '=',
          searchResults: '='
      },
      link: function postLink(scope, element, attrs) {
          scope.originalResources = scope.resources;

          scope.search = function() {
              if (scope.what.length < 3) {
                  scope.searchResults = scope.originalResources;
              } else if (scope.what.length > 2) {
                  scope.searchResults = _.compact(_.map(scope.originalResources, function(r) {
                      var pattern = scope.what;
                      var re = RegExp(scope.what, 'im');
                      var result = r.search(re);
                      if (result != -1) return r;
                  }));
              }
          }

          scope.reset = function() {
              delete scope.what;
              scope.searchResults = scope.originalResources;
          }
      }
    };
  });
