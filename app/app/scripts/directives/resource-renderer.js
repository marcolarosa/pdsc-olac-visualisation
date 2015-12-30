'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:resourceRenderer
 * @description
 * # resourceRenderer
 */
angular.module('appApp')
  .directive('resourceRenderer', [ 
    '$timeout', 
    '$rootScope',
    'configuration',
        function ($timeout, $rootScope, conf) {
    return {
      templateUrl: 'views/resource-renderer.html',
      restrict: 'E',
      scope: {
          title: '@',
          resources: '='
      },
      link: function postLink(scope, element, attrs) {
          // fix the links on the way through
          scope.resources = _.map(scope.resources, function(r, i) {
              return r.replace('/item/', conf.languageArchives + '/item/');
          });

          scope.config = {
              pageSize: 10,
              start: 0,
              numberFrom: 1,
              hide: true,
              enablePagination: false,
              me: false
          }

          scope.$on('close-item', function() {
              if (!scope.config.me) scope.config.hide = true;
              scope.config.me = false;
          });

          scope.$watch('searchResults', function(){
              if (scope.searchResults) {
                  scope.resources = scope.searchResults;
              }
              scope.updateSet();
          }, true);

          if (scope.resources.length > scope.config.pageSize) {
              scope.resourceSet = scope.resources.slice(0,scope.config.pageSize);
              scope.enablePagination = true;
          } else {
              scope.resourceSet = scope.resources;
          }

          scope.updateSet = function() {
              scope.config.numberFrom = scope.config.start + 1;
              scope.resourceSet = scope.resources.slice(scope.config.start, scope.config.start + scope.config.pageSize);
          }

          scope.jumpToStart = function() {
              scope.config.start = 0;
              scope.updateSet();
          }
          scope.back = function() {
              scope.config.start -= scope.config.pageSize;
              if (scope.config.start < 0) scope.config.start = 0;
              scope.updateSet();
          }
          scope.forward = function() {
              if (scope.config.start < (scope.resources.length - scope.config.pageSize)) {
                  scope.config.start += scope.config.pageSize;
              }
              scope.updateSet();
          }
          scope.jumpToEnd = function() {
              scope.config.start = scope.resources.length - scope.config.pageSize;
              scope.updateSet();
          }

          scope.toggleItem = function() {
              scope.config.me = true;
              $rootScope.$broadcast('close-item');
              $timeout(function() {
                  scope.config.hide =  !scope.config.hide;
              }, 10);
          }

      }
    };
  }]);
