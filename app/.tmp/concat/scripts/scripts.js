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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      // disable debug logging
      $logProvider.debugEnabled(false);

  }]);

'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('MainCtrl', [ 
    '$scope', 
    '$http', 
    '$mdSidenav', 
    '$mdDialog',
    function ($scope, $http, $mdSidenav, $mdDialog) {
        $mdDialog.show({
            template: '<div aria-label="loading" layout="column" layout-align="center center">' + 
                      '    <md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                      '</div>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });

        $scope.config = {
            controlsOpen: false
        }

        $scope.datasets = {
            'languages': undefined,
            'countries': undefined,
            'regions': undefined
        }

        $http.get('/data/index.json').then(function(resp) {
            $scope.datasets.languages = resp.data;
            console.log('Languages', $scope.datasets.languages);
        });
        /*
        $http.get('/data/regions.json').then(function(resp) {
            console.log('Regions', resp.data);
            $scope.datasets.regions = resp.data;
        });
        */
        $http.get('/data/countries.json').then(function(resp) {
            $scope.datasets.countries = resp.data;
            console.log('Countries', $scope.datasets.countries);
        });

        $scope.toggleSideNav = function() {
            $mdSidenav('right').toggle();
        }

  }]);

'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

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

'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:browseByCountry
 * @description
 * # browseByCountry
 */
angular.module('appApp')
  .directive('browse', [ 
    '$http', 
    '$mdSidenav',
    'configuration',
        function ($http, $mdSidenav, conf) {
    return {
      templateUrl: 'views/browse.html',
      restrict: 'E',
      scope: {
          countries: '=',
          languages: '=',
          isVisible: '='
      },
      link: function postLink(scope, element, attrs) {

          scope.$watch('isVisible', function() {
              if (scope.isVisible) {
                  if (conf.selectedLanguage) {
                      scope.show('language', { code: conf.selectedLanguage });
                      delete conf.selectedLanguage;
                  } else {
                      scope.browseCountries();
                  }
              }
          });

          scope.show = function(what, item) {
              if (what === 'country') {
                  scope.showBreadcrumb = true;
                  scope.country = item.name;
                  scope.title = 'Browse languages in ' + scope.country;
                  scope.items = {
                      list: _.sortBy(scope.countries[scope.country].language_data, function(l) { return l.name; }),
                      what: 'language'
                  }
                  scope.error = false;
              } else if (what === 'language') {
                  $http.get('/data/' + item.code + '.json').then(function(resp) {
                      scope.title = '';
                      var languageData = resp.data;
                      scope.languageData = resp.data;
                      scope.error = false;
                  }, function(error) {
                      delete scope.languageData;
                      scope.error = true;
                  });
              }
          }

          scope.browseCountries = function() {
              scope.showBreadcrumb = false;
              scope.country = null;
              delete scope.languageData;
              scope.title = 'Browse countries';
              scope.items = {
                  list: _.sortBy(scope.countries, function(country) { return country.name; }),
                  what: 'country'
              }
          }

          scope.browseLanguages = function() {
              scope.title = 'Browse languages in ' + scope.country;
              delete scope.languageData;
          }

          scope.back = function() {
              if (scope.languageData) {
                  scope.browseLanguages()
              } else if (scope.country) {
                  scope.browseCountries();
              }
          }

          scope.close = function() {
              $mdSidenav('right').toggle();
          }

      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name appApp.supporters
 * @description
 * # supporters
 * Service in the appApp.
 */

// give me underscore
angular.module('underscore', []).factory('_', function() {
    return window._;
});

// give me leaflet
angular.module('leaflet', []).factory('leaflet', function() {
    return window.L;
});

'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:leaflet
 * @description
 * # leaflet
 */
angular.module('appApp')
  .directive('leaflet', [
    'leaflet',
    '_',
    'configuration',
    '$compile',
    '$mdDialog',
    '$window',
    '$mdSidenav',
    function (leaflet, _, conf, $compile, $mdDialog, $window, $mdSidenav) {
    return {
      template: '<div id="map"></div>',
      restrict: 'E',
      scope: {
          languages: '='
      },
      link: function postLink(scope, element, attrs) {
          angular.element(document.getElementById('map'))[0].style.height = ($window.innerHeight * 0.90) + 'px';
          var map = L.map('map', { minZoom: 1 }).setView([0,0],2);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
              noWrap: true
          }).addTo(map);

          var markerList = _.compact(_.map(scope.languages, function(l) {
              if (parseFloat(l.coords[0])  && parseFloat(l.coords[2])) {
                  var c = 0;
                  _.each(l.resources, function(r) {
                      c += r;
                  });
                  var color;
                  if (c < 20) {
                      color = conf.markerColours[0];
                  } else if (c < 150) {
                      color = conf.markerColours[1];
                  } else {
                      color = conf.markerColours[2];
                  }

                  var element = $compile("<span><h4>" + l.name + "<br/> (" + c + " resources)</h4><br/><a href='' ng-click='moreInfo(\"" + l.code + "\")'>more information</a></span>")(scope);
                  var marker = L.marker(new L.LatLng(parseFloat(l.coords[0]), parseFloat(l.coords[2])), {
                      clickable: true,
                      icon: L.MakiMarkers.icon({
                          icon: 'marker',
                          color: color,
                          size: 'l'
                      }),
                  });
                  marker.bindPopup(element[0]);
                  return marker;
              }
          }));

          var markers = L.markerClusterGroup();
          markers.addLayers(markerList);
          map.addLayer(markers);

          // cancel the loading dialog
          $mdDialog.cancel();

          scope.moreInfo = function(language) {
              conf.selectedLanguage = language;
              $mdSidenav('right').toggle();
          }
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name appApp.configuration
 * @description
 * # configuration
 * Constant in the appApp.
 */
angular.module('appApp')
  .constant('configuration', {
      'languageArchives': 'http://www.language-archives.org',
      'map': {
          'width': '100%',
          'height': window.innerHeight * 0.95,
      },
      'markerColours': [ '#ea1540', '#ff8c00', '#2eb82e' ]
  });

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

'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:searchResources
 * @description
 * # searchResources
 */
angular.module('appApp')
  .directive('searchResources', function () {
    return {
      templateUrl: 'views/search-resources.html',
      restrict: 'E',
      scope: {
          resources: '=',
          searchResults: '='
      },
      link: function postLink(scope, element, attrs) {
          scope.originalResources = scope.resources;

          scope.search = function() {
              if (scope.what.length < 3) {
                  scope.searchResults = scope.originalResources;
              } else if (scope.what.length > 2) {
                  scope.searchResults = _.compact(_.map(scope.originalResources, function(r) {
                      var pattern = scope.what;
                      var re = RegExp(scope.what, 'im');
                      var result = r.search(re);
                      if (result != -1) return r;
                  }));
              }
          }

          scope.reset = function() {
              delete scope.what;
              scope.searchResults = scope.originalResources;
          }
      }
    };
  });

angular.module('appApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/browse.html',
    "<md-toolbar layout=\"row\" class=\"md-padding\"> <md-button class=\"md-primary\" ng-click=\"back()\" ng-if=\"country\">back</md-button> <h5>{{title}}</h5> <span flex></span> <md-button class=\"md-primary\" ng-click=\"close()\">close</md-button> </md-toolbar> <md-content ng-if=\"!languageData\"> <md-list> <md-list-item ng-click=\"show(items.what, item)\" ng-repeat=\"item in items.list\"> {{item.name}}<span ng-if=\"item.count\">&nbsp;({{item.count}} languages)</span> </md-list-item> </md-list> </md-content> <md-content ng-if=\"languageData\"> <h4 class=\"md-title\"><span ng-if=\"country\">{{country}}:</span> {{languageData.name}}</h4> <p> <a href=\"{{languageData.url}}\" target=\"_blank\">{{languageData.url}}</a> </p> <md-list> <span ng-if=\"languageData.resources['Primary texts']\"> <resource-renderer title=\"Primary Texts\" resources=\"languageData.resources['Primary texts'].resources\"></resource-renderer> </span> <span ng-if=\"languageData.resources['Lexical resources']\"> <resource-renderer title=\"Lexical Resources\" resources=\"languageData.resources['Lexical resources'].resources\"></resource-renderer> </span> <span ng-if=\"languageData.resources['Language descriptions']\"> <resource-renderer title=\"Language Descriptions\" resources=\"languageData.resources['Language descriptions'].resources\"></resource-renderer> </span> <span ng-if=\"languageData.resources['Other resources about the language']\"> <resource-renderer title=\"Other resources about the language\" resources=\"languageData.resources['Other resources about the language'].resources\"></resource-renderer> </span> </md-list> </md-content> <md-content ng-if=\"error\" layout=\"column\" layout-align=\"center center\"> <img src=\"images/error.svg\"> Whatever your language and however you say it it doesn't change the fact that something went wrong trying to get the data for that language! </md-content>"
  );


  $templateCache.put('views/main.html',
    "<div layout=\"column\" ng-if=\"datasets.languages\"> <md-content> <md-card> <md-card-content> <leaflet languages=\"datasets.languages\" ng-if=\"datasets.languages\"></leaflet> </md-card-content> </md-card> </md-content> <md-fab-speed-dial class=\"md-fab-bottom-right\" style=\"z-index: 10000\"> <md-fab-trigger> <md-button aria-label=\"menu\" class=\"md-fab md-warn\" ng-click=\"toggleSideNav()\"> <i class=\"material-icons md-48\">add</i> </md-button> </md-fab-trigger> </md-fab-speed-dial> </div> <md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"right\" style=\"z-index: 10000\" md-is-open=\"config.controlsOpen\"> <md-content> <div layout=\"column\" layout-padding> <md-content flex=\"50\" layout-padding> <browse countries=\"datasets.countries\" languages=\"datasets.languages\" is-visible=\"config.controlsOpen\"></browse> </md-content> </div> </md-content> </md-sidenav>"
  );


  $templateCache.put('views/marker-legend.html',
    "<div layout=\"row\" class=\"legendOverlay\"> <span ng-repeat=\"colour in colours\"> <div style=\"background-color: {{colour}}; width: 40px; height: 40px\"></div> </span> </div>"
  );


  $templateCache.put('views/resource-renderer.html',
    "<div layout=\"column\"> <md-list-item ng-click=\"toggleItem()\"> {{title}} ({{resources.length}}) </md-list-item> <span ng-hide=\"config.hide\"> <md-divider></md-divider> <search-resources resources=\"resources\" search-results=\"searchResults\"></search-resources> <div layout=\"column\"> <ol class=\"no-margin\" start=\"{{config.numberFrom}}\"> <span ng-repeat=\"resource in resourceSet\"> <p ng-bind-html=\"resource\"></p> </span> </ol> </div> <div class=\"\" layout=\"row\" layout-align=\"center center\" ng-if=\"enablePagination\" flex> <md-button class=\"md-primary\" ng-click=\"jumpToStart()\"><i class=\"material-icons\">fast_rewind</i></md-button> <md-button class=\"md-primary\" ng-click=\"back()\"><i class=\"material-icons\">skip_previous</i></md-button> <md-button class=\"md-primary\" ng-click=\"forward()\"><i class=\"material-icons\">skip_next</i></md-button> <md-button class=\"md-primary\" ng-click=\"jumpToEnd()\"><i class=\"material-icons\">fast_forward</i></md-button> </div> <md-divider></md-divider> </span> </div>"
  );


  $templateCache.put('views/search-resources.html',
    "<div layout=\"row\"> <md-input-container flex> <label>Filter the resources</label> <input type=\"text\" ng-model=\"what\" ng-change=\"search()\"> </md-input-container> <md-button ng-click=\"reset()\" class=\"md-primary\">Reset</md-button> </div>"
  );

}]);
