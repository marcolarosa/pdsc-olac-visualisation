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
      $http.get('/data/index.json').then(function(resp) {
          console.log('Languages', resp.data);
          $scope.languages = _.groupBy(resp.data, 'name');
      });
      $http.get('/data/regions.json').then(function(resp) {
          console.log('Regions', resp.data);
          $scope.regions = resp.data;
      });
      $http.get('/data/countries.json').then(function(resp) {
          console.log('Countries', resp.data);
          $scope.countries = resp.data;
      });

  }]);
