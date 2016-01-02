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
