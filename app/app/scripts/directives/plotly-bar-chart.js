'use strict';

angular.module('appApp')
  .directive('plotlyBarChart', [ 
    'dataService',
    '_',
    function (ds, _) {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
          limit: '=',
          data: '='
      },
      link: function postLink(scope, element) {
          scope.$watch('limit', function() {
              scope.graphIt();
          });

          scope.layout = {
              title: 'Languages vs resource count',
              height: 300,
              xaxis: {
                  title: 'Number of resources'
              },
              yaxis: {
                  title: 'Number of languages'
              }
          }

          scope.graphIt = function() {
              scope.d = [
                  {
                      x: scope.data.x.slice(0,scope.limit),
                      y: scope.data.y.slice(0,scope.limit),
                      type: 'bar'
                  }
              ]
              Plotly.newPlot(element[0], scope.d, scope.layout)
          }
      }
    };
  }]);

