'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:markerLegend
 * @description
 * # markerLegend
 */
angular.module('appApp')
  .directive('markerLegend', [ 'configuration', function (conf) {
    return {
      templateUrl: 'views/marker-legend.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope) {
          scope.colours = conf.markerColours;
      }
    };
  }]);
