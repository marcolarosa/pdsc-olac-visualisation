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
