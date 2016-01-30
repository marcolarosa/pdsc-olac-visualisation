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
          scope.$on('zoom-to', function() {
              if (conf.latlng.lat && conf.latlng.lng) {
                  scope.map.panTo( L.latLng(parseFloat(conf.latlng.lat), parseFloat(conf.latlng.lng)) );
                  scope.map.setZoom(8);
                  scope.markersByCode[conf.latlng.code].openPopup();
              }
              delete conf.latlng;
          });

          angular.element(document.getElementById('map'))[0].style.height = ($window.innerHeight * 0.80) + 'px';
          scope.map = L.map('map', { minZoom: 1 }).setView([0,0],2);

          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
              noWrap: true
          }).addTo(scope.map);

          scope.markersByCode = {};
          var markerList = _.compact(_.map(scope.languages, function(l) {
              if (parseFloat(l.coords[0])  && parseFloat(l.coords[2])) {
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
                  var marker = L.marker(new L.LatLng(parseFloat(l.coords[0]), parseFloat(l.coords[2])), {
                      clickable: true,
                      icon: L.MakiMarkers.icon({
                          icon: 'marker',
                          color: color,
                          size: 'l'
                      }),
                  });
                  scope.markersByCode[l.code] = marker;
                  marker.bindPopup(element[0]);
                  return marker;
              }
          }));

          var markers = L.markerClusterGroup();
          markers.addLayers(markerList);
          scope.map.addLayer(markers);

          // cancel the loading dialog
          $mdDialog.cancel();

          scope.moreInfo = function(language) {
              conf.selectedLanguage = language;
              $mdSidenav('right').toggle();
          }
      }
    };
  }]);
