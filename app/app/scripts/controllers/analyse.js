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

            $scope.data = {
                x: [],
                y: [],
                limit: 50,
            }

            $scope.processData = function() {
                $scope.byCount = _.groupBy(ds.datasets.languages, 'count');
                _.each($scope.byCount, function(value, key) {
                    $scope.data.x.push(key);
                    $scope.data.y.push(value.length);
                });

                $scope.data.xTotal = $scope.data.x.length;
            }

            if (_.isNull(ds.datasets.languages) || _.isNull(ds.datasets.countries)) {
                ds.init().then(function() {
                    $scope.datasets = ds.datasets;
                    $scope.processData();
                    $scope.dataLoaded = true;
                });
            } else {
                $scope.datasets = ds.datasets;
                $scope.processData();
                $scope.dataLoaded = true;
            }

        }
    ]);
