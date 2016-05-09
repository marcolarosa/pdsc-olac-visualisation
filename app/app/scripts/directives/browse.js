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
    'configuration',
    '$rootScope',
    '_',
        function ($http, $mdSidenav, conf, $rootScope, _) {
    return {
      templateUrl: 'views/browse.html',
      restrict: 'E',
      scope: {
          countries: '=',
          languages: '=',
          isVisible: '='
      },
      link: function postLink(scope) {

          // create an object keyed on language code which tells us how many 
          //   resources are availabel for the language so we can display it 
          //   when browsing the language list for a country.
          scope.$watch('languages', function() {
              if (scope.languages) {
                  scope.languageCounts = {}; 
                  _.each(scope.languages, function(l) {
                      scope.languageCounts[l.code] = 0;
                      _.each(l.resources, function(r) {
                          scope.languageCounts[l.code] += r;
                      });
                  });
                  _.each(scope.countries, function(country) {
                      _.each(country.language_data, function(language) {
                          language.count = scope.languageCounts[language.code];
                          if (language.count < 20) {
                              language.colour = conf.markerColours[0].colour;
                          } else if (language.count > 20 && language.count < 150) {
                              language.colour = conf.markerColours[1].colour;
                          } else {
                              language.colour = conf.markerColours[2].colour;
                          }
                      });
                  });
              }
          });

          scope.$watch('isVisible', function() {
              if (scope.isVisible) {
                  if (conf.selectedLanguage) {
                      scope.show('language', { code: conf.selectedLanguage });
                  } else {
                      scope.browseCountries();
                  }
              } else {
                  // wipe the slate clean
                  delete conf.selectedLanguage;
                  delete scope.languageData;
                  delete scope.country;
                  delete scope.items;
              }
          });

          scope.show = function(what, item) {
              if (what === 'country') {
                  scope.country = item.name;
                  scope.title = 'Browse languages in ' + scope.country;
                  scope.items = {
                      list: _.sortBy(scope.countries[scope.country].language_data, function(l) { return l.name; }),
                      what: 'language'
                  };
                  scope.error = false;
              } else if (what === 'language') {
                  $http.get('data/' + item.code + '.json').then(function(resp) {
                      scope.title = '';
                      scope.languageData = resp.data;
                      conf.latlng = {
                          code: scope.languageData.code,
                          lat: scope.languageData.coords[0],
                          lng: scope.languageData.coords[1]
                      };
                      $rootScope.$broadcast('zoom-to');
                      scope.error = false;
                  }, function() {
                      delete scope.items;
                      delete scope.languageData;
                      scope.error = true;
                  });
              }
          };

          scope.browseCountries = function() {
              scope.country = null;
              delete scope.languageData;
              scope.title = 'Browse countries';
              scope.items = {
                  list: _.sortBy(scope.countries, function(country) { return country.name; }),
                  what: 'country'
              };
          };

          scope.browseLanguages = function() {
              scope.title = 'Browse languages in ' + scope.country;
              delete scope.languageData;
          };

          scope.back = function() {
              if (scope.languageData) {
                  scope.browseLanguages();
              } else if (scope.country) {
                  scope.browseCountries();
              }
          };

          scope.close = function() {
              $mdSidenav('right').toggle();
          };

      }
    };
  }]);
