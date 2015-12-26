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
    function (leaflet, _, conf, $compile, $mdDialog) {
    return {
      template: '<div id="map" style="height: 800px;"></div>',
      restrict: 'E',
      scope: {
          languages: '='
      },
      link: function postLink(scope, element, attrs) {
          var map = L.map('map', { minZoom: 2 }).setView([0,0],2);
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

          scope.moreInfo = function(marker) {
              console.log(marker);
          }
      }
    };
  }]);
