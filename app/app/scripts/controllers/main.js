'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('MainCtrl', [ 
    '$scope', 
    '$http', 
    '$mdSidenav', 
    '$mdDialog',
    function ($scope, $http, $mdSidenav, $mdDialog) {
        $mdDialog.show({
            template: '<div><md-progress-linear md-mode="determinate"></md-progress-linear></div>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });

        $scope.config = {
            controlsOpen: false
        }

        $scope.datasets = {
            'languages': undefined,
            'countries': undefined,
            'regions': undefined
        }

        $http.get('/data/index.json').then(function(resp) {
            $scope.datasets.languages = resp.data;
            console.log('Languages', $scope.datasets.languages);
        });
        /*
        $http.get('/data/regions.json').then(function(resp) {
            console.log('Regions', resp.data);
            $scope.datasets.regions = resp.data;
        });
        */
        $http.get('/data/countries.json').then(function(resp) {
            $scope.datasets.countries = resp.data;
            console.log('Countries', $scope.datasets.countries);
        });

        $scope.toggleSideNav = function() {
            $mdSidenav('right').toggle();
        }

  }]);
