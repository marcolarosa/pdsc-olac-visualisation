'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:browseByCountry
 * @description
 * # browseByCountry
 */
angular.module('appApp')
  .directive('browseByCountry', function () {
    return {
      templateUrl: 'views/browse-by-country.html',
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
