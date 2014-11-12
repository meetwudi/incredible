angular.module('incredible', ['incredible.controllers', 
  'incredible.services',
  'incredible.directives',
  'incredible.routes',
  'ui.bootstrap'])


.run(function($rootScope) {
  $rootScope.application = {};
  $rootScope.application.close = function() {
    require('nw.gui').Window.get().close(true);
  };
});