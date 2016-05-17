'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module('appApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'underscore',
    'leaflet',
  ])
  .config([
    '$routeProvider',
    '$logProvider',
  function ($routeProvider, $logProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/analyse', {
        templateUrl: 'views/analyse.html',
        controller: 'AnalyseCtrl',
        controllerAs: 'analyse'
      })
      .otherwise({
        redirectTo: '/'
      });

      // disable debug logging
      $logProvider.debugEnabled(false);

  }]);
