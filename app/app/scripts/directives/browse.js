'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:browseByCountry
 * @description
 * # browseByCountry
 */
angular.module('appApp')
  .directive('browse', [ 
    '$http', 
    '$mdSidenav',
        function ($http, $mdSidenav) {
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
                  scope.browseCountries();
              }
          });

          scope.show = function(what, item) {
              if (what === 'country') {
                  scope.showBreadcrumb = true;
                  scope.country = item.name;
                  scope.title = 'Browse languages in ' + scope.country;
                  scope.items = {
                      list: _.sortBy(scope.countries[scope.country].language_data, function(l) { return l.name; }),
                      what: 'language'
                  }
              } else if (what === 'language') {
                  $http.get('/data/' + item.code + '.json').then(function(resp) {
                      scope.title = '';
                      var languageData = resp.data;
                      scope.languageData = resp.data;
                  });
              }
          }

          scope.browseCountries = function() {
              scope.showBreadcrumb = false;
              scope.country = null;
              delete scope.languageData;
              scope.title = 'Browse countries';
              scope.items = {
                  list: _.sortBy(scope.countries, function(country) { return country.name; }),
                  what: 'country'
              }
          }

          scope.browseLanguages = function() {
              scope.title = 'Browse languages in ' + scope.country;
              delete scope.languageData;
          }

          scope.back = function() {
              if (scope.languageData) {
                  scope.browseLanguages()
              } else if (scope.country) {
                  scope.browseCountries();
              }
          }

          scope.close = function() {
              $mdSidenav('right').toggle();
          }

      }
    };
  }]);
