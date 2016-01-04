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
      'markerColours': [ 
        {
            colour: '#ea1540', 
            label: 'less than 20 resources'
        },
        {
            colour: '#ff8c00', 
            label:  'between 20 and 150 resources'
        },
        {
            colour: '#2eb82e',
            label: 'more than 150 resources'
        }
      ]
  });
