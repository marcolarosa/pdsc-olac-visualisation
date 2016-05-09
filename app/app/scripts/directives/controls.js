'use strict';

angular.module('appApp')
  .directive('controls', [ 
    '$mdSidenav',
    'configuration',
    '$rootScope',
        function ($http, $mdSidenav, conf, $rootScope) {
    return {
      templateUrl: 'views/controls.html',
      restrict: 'E',
      scope: {
          languages: '=',
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  }]);
