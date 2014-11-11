angular.module('incredible.routes', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/setting', {
    templateUrl: 'scripts/templates/setting.tpl.html',
    controller: 'SettingController'
  }).when('/', {
    templateUrl: 'scripts/templates/upload.tpl.html',
    controller: 'UploadController'
  });
});
