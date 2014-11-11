angular.module('incredible.routes', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/setting', {
    templateUrl: 'scripts/templates/setting.tpl.html'
  }).when('/', {
    templateUrl: 'scripts/templates/upload.tpl.html',
    controller: 'UploadController'
  }).when('/manage', {
    templateUrl: 'scripts/templates/manage.tpl.html',
    controller: 'ManageController'
  });
});
