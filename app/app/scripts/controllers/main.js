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
    '_',
    'dataService',
    function ($scope, $http, $mdSidenav, $mdDialog, _, ds) {
        $mdDialog.show({
            template: '<div aria-label="loading" layout="column" layout-align="center center">' + 
                      '    <md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                      '</div>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });

        $scope.config = {
            controlsOpen: false
        };

        $scope.datasets = {
            'languages': undefined,
            'countries': undefined,
            'regions': undefined
        };

        ds.get('languages').then(function(languages) {
            $scope.datasets.languages = languages;
        });
        //ds.get('regions').then(function(regions) {
        //    $scope.datasets.regions = regions;
        //});
        ds.get('countries').then(function(countries) {
            $scope.datasets.countries = countries;
        });

        $scope.toggleSideNav = function() {
            $mdSidenav('right').toggle();
        };

  }]);
