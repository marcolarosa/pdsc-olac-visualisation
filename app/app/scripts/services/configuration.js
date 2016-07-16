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
            colour: '#212121', 
            label: 'fewer than 20 resources'
        },
        {
            colour: '#BDBDBD', 
            label:  'between 20 and 150 resources'
        },
        {
            colour: '#FFEB3B',
            label: 'more than 150 resources'
        }
      ]
  });
