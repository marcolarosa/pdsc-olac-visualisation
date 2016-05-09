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
          scope.resourceFilters = [];

          scope.$watch('languages', function() {
              if (scope.languages !== undefined) {
                  scope.extractResourceTypes();
              }
          });

          scope.extractResourceTypes = function() {
              var resourceTypes = [];
              var resources = _.map(scope.languages, function(language) {
                  return _.keys(language.resources);
              });
              resourceTypes.push(resources);
              scope.resourceTypes = _.uniq(_.flatten(resources)).sort();
          };


          scope.filter = function(resource) {
              if (_.contains(scope.resourceFilters, resource)) {
                  scope.resourceFilters = _.without(scope.resourceFilters, resource);
              } else {
                  scope.resourceFilters.push(resource);
              }

              if (_.isEmpty(scope.resourceFilters)) {
                  scope.languages = ds.datasets.languages;
                  scope.countries = ds.datasets.countries;
              } else {
                  scope.languages = _.compact(_.map(ds.datasets.languages, function(l) {
                      if (!_.isEmpty(_.intersection(_.keys(l.resources), scope.resourceFilters))) {
                          return l;
                      }
                  }));

                  scope.countries = [];
                  _.each(scope.languages, function(l) {
                      var c = ds.datasets.languageToCountryMapping[l.code];
                      if (c) {
                          scope.countries.push(ds.datasets.countryByKey[c[0]]);
                      }
                  });
              }
          };


          scope.close = function() {
              $mdSidenav('right').toggle();
          };
      }
    };
  }]);
