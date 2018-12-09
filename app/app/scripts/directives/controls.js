"use strict";

angular.module("appApp").directive("controls", [
  "dataService",
  "$timeout",
  "_",
  "$location",
  function(ds, $timeout, _, $location) {
    return {
      templateUrl: "views/controls.html",
      restrict: "E",
      scope: {},
      link: function postLink(scope) {
        scope.data = {
          selectedCountry: {},
          selectedResource: {}
        };
        scope.resourceTypes = ds.datasets.resourceTypes;
        scope.countries = _.sortBy(ds.datasets.filtered.countries, "name");
        scope.$on(
          "dataset filtered",
          function() {
            scope.countries = _.sortBy(ds.datasets.filtered.countries, "name");
          },
          true
        );

        scope.filterByResource = function(resource) {
          $timeout(function() {
            scope.data.selectedCountry = {};
            ds.filterByResource(resource);
          }, 100);
        };

        scope.filterByCountry = function(country) {
          $timeout(function() {
            scope.data.selectedResources = {};
            ds.filterByCountry(country);
          }, 100);
        };

        scope.jumpToMap = function() {
          var p = $location.path();
          $location.path(p.split("/analyse")[0]);
        };
      }
    };
  }
]);
