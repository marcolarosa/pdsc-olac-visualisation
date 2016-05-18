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
    '$timeout',
    function (leaflet, _, conf, $compile, $mdDialog, $window, $mdSidenav, $timeout) {
    return {
      templateUrl: 'views/leaflet.html',
      restrict: 'E',
      scope: {
          languages: '='
      },
      link: function postLink(scope) {
          scope.showLoadingIndicator = true;
          scope.compiledPopups = {};

          scope.$on('zoom-to', function() {
              if (conf.latlng.lat && conf.latlng.lng) {
                  scope.map.panTo(leaflet.latLng(parseFloat(conf.latlng.lat), parseFloat(conf.latlng.lng)) );
                  scope.map.setZoom(8);
                  scope.markersByCode[conf.latlng.code].openPopup();
              }
              delete conf.latlng;
          });
          scope.$watch('languages', function() {
              if (scope.markers && scope.markerList) {
                  scope.markers.removeLayers(scope.markerList);
              }
              $timeout(function() {
                  scope.drawMarkers();
              }, 1000);
          });

          angular.element(document.getElementById('map'))[0].style.height = ($window.innerHeight * 0.70) + 'px';
          scope.map = leaflet.map('map', { minZoom: 1 }).setView([0,0],2);

          leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
              noWrap: true
          }).addTo(scope.map);

          scope.updateProgressBar = function(processed, total) {
              scope.$apply(function() {
                  scope.progress = Math.round(processed/total*100);

                  if (processed === total) {
                      $timeout(function() {
                          scope.showLoadingIndicator = false;
                      }, 500);
                  }
              });
          };

          scope.markers = leaflet.markerClusterGroup({ 
              chunkedLoading: true, 
              chunkInterval: 50,
              chunkDelay: 50,
              chunkProgress: scope.updateProgressBar 
          });

          scope.drawMarkers = function() {
              scope.markersByCode = {};
              scope.markerList = _.compact(_.map(scope.languages, function(l) {
                  if (parseFloat(l.coords[0]) && parseFloat(l.coords[1])) {
                      var c = 0;
                      _.each(l.resources, function(r) {
                          c += r;
                      });
                      var color;
                      if (c < 20) {
                          color = conf.markerColours[0].colour;
                      } else if (c < 150) {
                          color = conf.markerColours[1].colour;
                      } else {
                          color = conf.markerColours[2].colour;
                      }

                      var marker = leaflet.marker(new leaflet.LatLng(parseFloat(l.coords[0]), parseFloat(l.coords[1])), {
                          clickable: true,
                          icon: leaflet.MakiMarkers.icon({
                              icon: 'marker',
                              color: color,
                              size: 'l'
                          }),
                      });
                      scope.markersByCode[l.code] = marker;
                      if (!scope.compiledPopups[l.name]) {
                          var popup = $compile("<span><h4>" + l.name + "<br/> (" + c + " resources)</h4><br/><a href='' ng-click='moreInfo(\"" + l.code + "\")'>more information</a></span>")(scope);
                          scope.compiledPopups[l.name] = popup[0];
                      }
                      marker.bindPopup(scope.compiledPopups[l.name]);
                      marker.bindLabel(l.name, { 'noHide': true, 'direction': 'auto' });
                      return marker;
                  }
              }));

              scope.markers.addLayers(scope.markerList);
              scope.map.addLayer(scope.markers);
              $timeout(function() {
                  var group = new L.featureGroup(scope.markerList);
                  scope.map.fitBounds(group.getBounds());
              }, 2500);
          };

          scope.moreInfo = function(language) {
              conf.selectedLanguage = language;
              $mdSidenav('right').toggle();
          };
      }
    };
  }]);
