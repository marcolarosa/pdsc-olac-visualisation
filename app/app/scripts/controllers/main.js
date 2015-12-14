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
    '$scope', '$http', '$window', '$mdSidenav',
    function ($scope, $http, $window, $mdSidenav) {
      $scope.mapHeight = $window.innerHeight * 0.95;

      $scope.layers = {
          baselayers: {
              osm: {
                  name: 'OpenStreetMap',
                  type: 'xyz',
                  url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  layerParams: {
                      noWrap: true,
                  }
              }
          },
          overlays: {
              realworld: {
                  name: "Real world data",
                  type: "markercluster",
                  visible: true,
                  layerParams: {
                      zoom: 4
                  }
              }
          }
      }
      $scope.selected = {};
      $scope.datasets = {
          'languages': undefined,
          'countries': undefined,
          'regions': undefined
      }

      var search = function(what, item) {
          var searchWhat = $scope.datasets[what];
          if (item.name !== '') {
              return _.filter(searchWhat, function(whats) { 
                  return whats.name.toLowerCase().match(item.name.toLowerCase()); 
              });
          } else {
              return searchWhat;
          }
      }

      $scope.searchLanguages = function(item) {
          return search('languages', item);
      };
      $scope.searchCountries = function(item) {
          return search('countries', item);
      };

      $http.get('/data/index.json').then(function(resp) {
          $scope.datasets.languages = resp.data;

          // figure out the language with the least number of resources
          //  and the one with the most. These are the bounds we'll use 
          //  to split the set up and colour the markers
          console.log($scope.datasets.languages);
          var counts = _.map($scope.datasets.languages, function(l) {
              var c = 0
              _.each(l.resources, function(r) {
                  c += r;
              });
              return c;
          });
          console.log(counts.sort(function(a, b) {
              return a - b;
          }));

          // 5 x reds, 5 x greens
          //$scope.colours = [ '#ea1540', '#dc143c', '#d21339', '#bb1133', '#a40f2d',
          //                '#2eb82e', '#29a329', '#248f24', '#1f7a1f', '#196619' ];

          $scope.colours = [ '#ea1540', '#ff8c00', '#2eb82e' ];

          var markers = _.map($scope.datasets.languages, function(l) {
              if (parseFloat(l.coords[0])  && parseFloat(l.coords[2])) {
                  var c = 0;
                  _.each(l.resources, function(r) {
                      c += r;
                  });
                  var color;
                  if (c < 20) {
                      color = $scope.colours[0];
                  } else if (c < 150) {
                      color = $scope.colours[1];
                  } else {
                      color = $scope.colours[2];
                  }
                  return { 
                      layer: 'realworld',  
                      lat: parseFloat(l.coords[0]), 
                      lng: parseFloat(l.coords[2]),
                      message: "<h4>" + l.name + "<br/> (" + c + " resources)</h4><br/><a href='' ng-click='moreInfo(\"" + l.code + "\")'>more information</a>",
                      getMessageScope: function() {return $scope; },
                      icon: {
                          type: 'makiMarker',
                          icon: 'marker',
                          color: color,
                          size: 'l'
                      }
                  }; 
              }
          });
          $scope.markers = _.compact(markers);

          //markers = _.groupBy(_.compact(markers).slice(0,100), 'message');
          //_.each(markers, function(m, i) {
          //    $scope.markers[_.camelCase(i)] = m[0];
          //});
          //console.log($scope.markers);
      });
      $http.get('/data/regions.json').then(function(resp) {
          console.log('Regions', resp.data);
          $scope.datasets.regions = resp.data;
      });
      $http.get('/data/countries.json').then(function(resp) {
          console.log('Countries', resp.data);
          $scope.datasets.countries = resp.data;
      });
      $scope.moreInfo = function(code) {
          console.log(code);
      }
      $scope.toggleSideNav = function() {
          $mdSidenav('right').toggle();
      }

  }]);
