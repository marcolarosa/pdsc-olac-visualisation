'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:browseByCountry
 * @description
 * # browseByCountry
 */
angular.module('appApp')
  .directive('browse', function () {
    return {
      templateUrl: 'views/browse.html',
      restrict: 'E',
      scope: {
          countries: '=',
          isVisible: '='
      },
      link: function postLink(scope, element, attrs) {
          scope.$watch('isVisible', function() {
              if (scope.isVisible) {
                  scope.countriesList = _.keys(scope.countries).sort();
              }
          });

          scope.navigateTo = function(what) {
              console.log(what);
          }
      }
    };
  });
