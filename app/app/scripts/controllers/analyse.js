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

            $scope.reset = function() {
                $scope.data = {
                    x: [],
                    y: [],
                    limit: 50,
                }
            }

            $scope.processData = function() {
                $scope.reset();
                $scope.byCount = _.groupBy(ds.datasets.filtered.languages, 'count');
                _.each($scope.byCount, function(value, key) {
                    $scope.data.x.push(key);
                    $scope.data.y.push(value.length);
                });

                $scope.data.xTotal = $scope.data.x.length;
                $scope.dataLoaded = true;
            }

            if (_.isNull(ds.datasets.languages) || _.isNull(ds.datasets.countries)) {
                ds.init().then(function() {
                    $scope.processData();
                });
            } else {
                $scope.processData();
            }

            $scope.$on('dataset filtered', function() {
                $scope.processData();
            }, true);

        }
    ]);
