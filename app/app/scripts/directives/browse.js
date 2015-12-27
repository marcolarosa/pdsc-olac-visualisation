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
          languages: '=',
          isVisible: '='
      },
      link: function postLink(scope, element, attrs) {

          scope.$watch('isVisible', function() {
              if (scope.isVisible) {
                  scope.showBreadcrumb = false;
                  scope.browseBy = 'country';
                  scope.language = null;
                  scope.items = {
                    list: _.sortBy(scope.countries, function(country) { return country.name; }),
                    what: 'country'
                  }
              }
          });

          scope.show = function(what, item) {
              if (what === 'country') {
                  scope.browseBy = 'language';
                  scope.showBreadcrumb = true;
                  scope.language = item.name;
                  scope.items = {
                      list: _.sortBy(scope.countries[item.name].language_data, function(l) { return l.name; }),
                      what: 'language'
                  }
              } else if (what === 'language') {
                  console.log(item);
              }
          }
      }
    };
  });
