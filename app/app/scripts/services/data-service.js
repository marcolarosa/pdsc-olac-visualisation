'use strict';

angular.module('appApp')
  .service('dataService', [ '$http', '_', function ($http, _) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var ds = {};
      ds.datasets = {};
      ds.slice = 10;

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

      return ds;
  }]);
