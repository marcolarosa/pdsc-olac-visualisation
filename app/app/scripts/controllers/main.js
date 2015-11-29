'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('MainCtrl', [ '$scope', '$http', function ($scope, $http) {
      $scope.$watch('selected', function() {
          if ($scope.selected) console.log($scope.selected);
      }, true);
      $scope.selected = {};
      $scope.datasets = {
          'languages': undefined,
          'countries': undefined,
          'regions': undefined
      }

      var search = function(what, item) {
          var searchWhat = $scope.datasets[what];
          if (item.name !== '') {
              return _.filter(searchWhat, function(whats) { 
                  return whats.name.toLowerCase().match(item.name.toLowerCase()); 
              });
          } else {
              return searchWhat;
          }
      }

      $scope.searchLanguages = function(item) {
          return search('languages', item);
      };
      $scope.searchCountries = function(item) {
          return search('countries', item);
      };

      $http.get('/data/index.json').then(function(resp) {
          console.log('Languages', resp.data);
          $scope.datasets.languages = resp.data;

          var markers = _.map($scope.datasets.languages, function(l) {
              try {
                  if (parseFloat(l.coords[0])  && parseFloat(l.coords[2])) {
                      return { 
                          lat: parseFloat(l.coords[0]),
                          lng: parseFloat(l.coords[2]),
                          message: l.name
                      }
                  }
              } catch (e) {
                  // do nothing
              }
          });
          $scope.markers = {};
          markers = _.groupBy(_.compact(markers).slice(0,500), 'message');
          _.each(markers, function(m, i) {
              $scope.markers[_.camelCase(i)] = m[0];
          });
          console.log($scope.markers);
      });
      $http.get('/data/regions.json').then(function(resp) {
          console.log('Regions', resp.data);
          $scope.datasets.regions = resp.data;
      });
      $http.get('/data/countries.json').then(function(resp) {
          console.log('Countries', resp.data);
          $scope.datasets.countries = resp.data;
      });

  }]);
