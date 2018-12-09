"use strict";

angular.module("appApp").directive("plotlyBarChart", [
  function() {
    return {
      template: "<div></div>",
      restrict: "E",
      scope: {
        data: "="
      },
      link: function postLink(scope, element) {
        scope.layout = {
          title: "Languages vs resource count",
          height: 300,
          xaxis: {
            title: "Number of resources"
          },
          yaxis: {
            title: "Number of languages"
          }
        };

        scope.graphIt = function() {
          scope.d = [
            {
              x: scope.data.x.slice(0, scope.data.limit),
              y: scope.data.y.slice(0, scope.data.limit),
              type: "bar"
            }
          ];
          Plotly.newPlot(element[0], scope.d, scope.layout);
        };

        scope.$watch(
          "data",
          function() {
            scope.graphIt();
          },
          true
        );
        scope.graphIt();
      }
    };
  }
]);
