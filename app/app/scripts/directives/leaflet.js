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
      link: function postLink(scope) {
          scope.$on('zoom-to', function() {
              if (conf.latlng.lat && conf.latlng.lng) {
                  scope.map.panTo(leaflet.latLng(parseFloat(conf.latlng.lat), parseFloat(conf.latlng.lng)) );
                  scope.map.setZoom(8);
                  scope.markersByCode[conf.latlng.code].openPopup();
              }
              delete conf.latlng;
          });
          scope.$watch('languages', function() {
              if (scope.markers) {
                  scope.map.removeLayer(scope.markers);
              }
              scope.drawMarkers();
          });

          angular.element(document.getElementById('map'))[0].style.height = ($window.innerHeight * 0.70) + 'px';
          scope.map = leaflet.map('map', { minZoom: 1 }).setView([0,0],2);

          leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
              noWrap: true
          }).addTo(scope.map);

          scope.drawMarkers = function() {
              scope.markersByCode = {};
              var markerList = _.compact(_.map(scope.languages, function(l) {
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

                      var element = $compile("<span><h4>" + l.name + "<br/> (" + c + " resources)</h4><br/><a href='' ng-click='moreInfo(\"" + l.code + "\")'>more information</a></span>")(scope);
                      var marker = leaflet.marker(new leaflet.LatLng(parseFloat(l.coords[0]), parseFloat(l.coords[1])), {
                          clickable: true,
                          icon: leaflet.MakiMarkers.icon({
                              icon: 'marker',
                              color: color,
                              size: 'l'
                          }),
                      });
                      scope.markersByCode[l.code] = marker;
                      marker.bindPopup(element[0]);
                      marker.bindLabel(l.name, { 'noHide': true, 'direction': 'auto' });
                      return marker;
                  }
              }));

              scope.markers = leaflet.markerClusterGroup({ disableClusteringAtZoom: 8 });
              scope.markers.addLayers(markerList);
              scope.layer = scope.map.addLayer(scope.markers);
          }

          // cancel the loading dialog
          $mdDialog.cancel();

          scope.moreInfo = function(language) {
              conf.selectedLanguage = language;
              $mdSidenav('right').toggle();
          };
      }
    };
  }]);
