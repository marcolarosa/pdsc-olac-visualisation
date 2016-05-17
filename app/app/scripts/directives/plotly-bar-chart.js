'use strict';

angular.module('appApp')
  .directive('plotlyBarChart', [ 
    'dataService',
    function (ds) {
    return {
      templateUrl: 'views/plotly-bar-chart.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope) {
      }
    };
  }]);
