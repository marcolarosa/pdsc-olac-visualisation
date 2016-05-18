'use strict';

angular.module('appApp')
  .service('dataService', [ 
      '$http', 
      '_', 
      'configuration',
      '$rootScope',
      function ($http, _, conf, $rootScope) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var ds = {};
      ds.datasets = {
          'languages': null,
          'countries': null 
      };
      ds.datasets.filtered = {
      }
      ds.resourceFilters = [];
      ds.countryFilter = [];

      ds.reset = function() {
          ds.datasets.filtered.languages = angular.copy(ds.datasets.languages);
          ds.datasets.filtered.countries = angular.copy(ds.datasets.countries);
      };
      
      ds.init = function() {
          if (_.isNull(ds.datasets.languages) || _.isNull(ds.datasets.countries)) {
              return ds.get('languages').then(function(languages) {
                  ds.datasets.languages = languages;
                  return ds.get('countries');
              }).then(function(countries) {
                  ds.datasets.countries = countries;
                  ds.languageResourceCounts();
                  ds.mapLanguagesToCountries();
                  ds.countryByName();
                  ds.languageByCode();
                  ds.extractResourceTypes();
                  console.log(ds.datasets);
              });
          }
      }

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
                  ds.datasets.filtered[what] = data.slice(0,ds.slice);
              } else {
                  ds.datasets[what] = data;
                  ds.datasets.filtered[what] = data;
              }
              return ds.datasets[what];
          });
      };

      ds.mapLanguagesToCountries = function() {
          ds.datasets.languageToCountryMapping = {};
          _.each(ds.datasets.countries, function(country) {
              _.each(country.language_data, function(language) {
                  try {
                      ds.datasets.languageToCountryMapping[language.code].push(country.name);
                  } catch (e) {
                      ds.datasets.languageToCountryMapping[language.code] = [country.name];
                  }
              });
          });
      };

      ds.countryByName = function() {
          ds.datasets.countryByName = {};
          _.each(ds.datasets.countries, function(country) {
              ds.datasets.countryByName[country.name] = country;
          });
      };

      ds.languageByCode = function() {
          ds.datasets.languageByCode = {};
          _.each(ds.datasets.languages, function(language) {
              ds.datasets.languageByCode[language.code] = language;
          });
      };

      ds.languageResourceCounts = function() {
          _.each(ds.datasets.languages, function(l) {
              l.count = 0;
              _.each(l.resources, function(r) {
                  l.count += r;
              });
              l.colour = ds.languageColour(l);
          });
      };

      ds.languageColour = function(l) {
          if (l.count < 20) {
              return conf.markerColours[0].colour;
          } else if (l.count > 20 && l.count < 150) {
              return conf.markerColours[1].colour;
          } else {
              return conf.markerColours[2].colour;
          }
      };

      ds.extractResourceTypes = function() {
          var resources = _.map(ds.datasets.languages, function(language) {
              return _.keys(language.resources);
          });
          ds.datasets.resourceTypes = _.uniq(_.flatten(resources)).sort();
      };

      ds.filterByResource = function(resource) {
          if (_.contains(ds.resourceFilters, resource)) {
              ds.resourceFilters = _.without(ds.resourceFilters, resource);
          } else {
              ds.resourceFilters.push(resource);
          }

          var languages, countries, countryKeys;
          if (_.isEmpty(ds.resourceFilters)) {
              languages = ds.datasets.languages;
              countries = ds.datasets.countries;
          } else {
              languages = _.compact(_.map(ds.datasets.languages, function(l) {
                  if (!_.isEmpty(_.intersection(_.keys(l.resources), ds.resourceFilters))) {
                      return l;
                  }
              }));

              var languageCodes = _.keys(_.groupBy(languages, 'code'));
              countries = []; 
              countryKeys = [];
              _.each(languages, function(l) {
                  var c = ds.datasets.languageToCountryMapping[l.code];
                  if (c) {
                      var country = ds.datasets.countryByName[c[0]];
                      if (countryKeys.indexOf(country.name) === -1) {
                          countries.push(country);
                          countryKeys.push(country.name);
                      }
                  }
              });
              _.each(countries, function(country) {
                  var ld = _.map(country.language_data, function(l) {
                      if (languageCodes.indexOf(l.code) !== -1) {
                          return l;
                      }
                  });
                  country.language_data = _.compact(ld);
              });
          }
          ds.datasets.filtered.languages = languages;
          ds.datasets.filtered.countries = countries;
          $rootScope.$broadcast('dataset filtered');

      };

      ds.filterByCountry = function(country) {
          if (_.contains(ds.countryFilter, country)) {
              ds.countryFilter = _.without(ds.countryFilter, country);
          } else {
              ds.countryFilter.push(country);
          }
          var languages, countries, countryKeys;
          if (_.isEmpty(ds.countryFilter)) {
              languages = ds.datasets.languages;
              countries = ds.datasets.countries;
          } else {
              countries = [ country ];
              languages = _.compact(_.map(ds.datasets.languages, function(language) {
                  try {
                      if (ds.datasets.languageToCountryMapping[language.code].indexOf(country.name) !== -1) {
                          return language;
                      }
                  } catch (e) {
                      // ignore
                  }
              }));
          }
          ds.datasets.filtered.languages = languages;
          ds.datasets.filtered.countries = countries;
          $rootScope.$broadcast('dataset filtered');
      };

      return ds;
  }]);
