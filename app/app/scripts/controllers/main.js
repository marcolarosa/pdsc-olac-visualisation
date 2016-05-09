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
    '$timeout',
    function ($scope, $http, $mdSidenav, $mdDialog, _, ds, $timeout) {
        $scope.dataLoaded = false;
        $mdDialog.show({
            template: '<div aria-label="loading" layout="column" layout-align="center center">' + 
                      '    <md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                      '</div>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });

        $scope.datasets = {
            'languages': undefined,
            'countries': undefined,
            'regions': undefined
        };

        ds.get('languages').then(function(languages) {
            $scope.datasets.languages = languages;
            return ds.get('countries');
        }).then(function(countries) {
            $scope.datasets.countries = countries;
            ds.mapLanguagesToCountries();
            ds.countryByKey();
            ds.extractResourceTypes();

            $scope.dataLoaded = true;
            console.log(ds.datasets);

            $timeout(function() {
                $mdDialog.cancel();
            }, 200);
        });

        $scope.toggleSideNav = function() {
            $mdSidenav('right').toggle();
        };

  }]);
