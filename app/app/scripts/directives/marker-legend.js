'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:markerLegend
 * @description
 * # markerLegend
 */
angular.module('appApp')
  .directive('markerLegend', function () {
    return {
      templateUrl: 'views/marker-legend.html',
      restrict: 'E',
      scope: {
          colours: '='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
