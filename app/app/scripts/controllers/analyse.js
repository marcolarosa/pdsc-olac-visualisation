'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .controller('AnalyseCtrl', [ 
        '$scope', 
        'dataService',
        '_',
        function ($scope, ds, _) {
            if (_.isNull(ds.datasets.languages) || _.isNull(ds.datasets.countries)) {
                ds.init().then(function() {
                    $scope.datasets = ds.datasets;
                });
            } else {
                $scope.datasets = ds.datasets;
            }
        }
    ]);
