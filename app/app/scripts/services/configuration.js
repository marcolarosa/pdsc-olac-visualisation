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
