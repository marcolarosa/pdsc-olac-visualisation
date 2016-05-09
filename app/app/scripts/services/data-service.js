'use strict';

angular.module('appApp')
  .service('dataService', [ '$http', '_', function ($http, _) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var ds = {};
      ds.datasets = {};
      ds.resourceFilters = [];
      //ds.slice = 10;

      ds.get = function(what) {
          var url;
          switch(what) {
              case 'languages':
                  url = 'data/index.json';
                  break;
              case 'regions':
                  url = 'data/regions.json';
                  break;
              case 'countries':
                  url = 'data/countries.json';
                  break;
          }

          return $http.get(url).then(function(resp) {
              var data = _.compact(_.map(resp.data, function(d) {
                  try {
                      return d;
                  } catch (e) {
                      // do nothing
                  }
              }));
              if (ds.slice !== undefined) {
                  ds.datasets[what] = data.slice(0,ds.slice);
              } else {
                  ds.datasets[what] = data;
              }
              return ds.datasets[what];
          });
      };

      ds.mapLanguagesToCountries = function() {
          ds.datasets.languageToCountryMapping = {};
          _.each(ds.datasets.countries, function(country, key) {
              _.each(country.language_data, function(language) {
                  try {
                      ds.datasets.languageToCountryMapping[language.code].push(country.name);
                  } catch (e) {
                      ds.datasets.languageToCountryMapping[language.code] = [country.name]
                  }
              });
          });
      };

      ds.countryByKey = function() {
          ds.datasets.countryByKey = _.groupBy(ds.datasets.countries, 'name');
      };

      ds.extractResourceTypes = function() {
          var resources = _.map(ds.datasets.languages, function(language) {
              return _.keys(language.resources);
          });
          ds.datasets.resourceTypes = _.uniq(_.flatten(resources)).sort();
      }

      ds.filter = function(resource) {
          if (_.contains(ds.resourceFilters, resource)) {
              ds.resourceFilters = _.without(ds.resourceFilters, resource);
          } else {
              ds.resourceFilters.push(resource);
          }

          var languages, countries;
          if (_.isEmpty(ds.resourceFilters)) {
              languages = ds.datasets.languages;
              countries = ds.datasets.countries;
          } else {
              languages = _.compact(_.map(ds.datasets.languages, function(l) {
                  if (!_.isEmpty(_.intersection(_.keys(l.resources), ds.resourceFilters))) {
                      return l;
                  }
              }));

              countries = [];
              _.each(languages, function(l) {
                  var c = ds.datasets.languageToCountryMapping[l.code];
                  if (c) {
                      countries.push(ds.datasets.countryByKey[c[0]]);
                  }
              });
          }

          return {
              'languages': languages,
              'countries': countries
          }
      };
      return ds;
  }]);
