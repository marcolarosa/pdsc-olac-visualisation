"use strict";

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module("appApp", ["ngRoute", "ngMaterial", "underscore", "leaflet"])
  .config([
    "$routeProvider",
    "$logProvider",
    "$locationProvider",
    function($routeProvider, $logProvider, $locationProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/main.html",
          controller: "MainCtrl",
          controllerAs: "main"
        })
        .when("/analyse", {
          templateUrl: "views/analyse.html",
          controller: "AnalyseCtrl",
          controllerAs: "analyse"
        })
        .otherwise({
          redirectTo: "/"
        });

      $logProvider.debugEnabled(false);
      $locationProvider.hashPrefix("");
    }
  ]);
