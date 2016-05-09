'use strict';

angular.module('appApp')
  .service('dataService', [ '$http', '_', function ($http, _) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var ds = {};
      ds.datasets = {};
      ds.slice = 100;

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

      return ds;
  }]);
