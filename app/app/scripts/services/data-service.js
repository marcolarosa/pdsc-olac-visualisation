'use strict';

angular.module('appApp')
  .service('dataService', [ '$http', '_', function ($http, _) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var ds = {};
      ds.datasets = {};

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
              ds.datasets.what = _.compact(_.map(resp.data, function(what) {
                  try {
                      return what;
                  } catch (e) {
                      // do nothing
                  }
              }));
              console.log(what, ds.datasets.what);
              return ds.datasets.what;
          });
      };

      return ds;
  }]);
