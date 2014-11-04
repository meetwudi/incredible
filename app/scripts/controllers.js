angular.module('incredible.controllers', [])

.controller('SettingController', function($scope, settingService) {
  $scope.setting = {};
  $scope.applySetting = function() {
    settingService.save($scope.setting, function() {
      alert('Your setting have been saved.');
    });
  };
  settingService.get(function(setting) {
    $scope.setting = setting;
    $scope.$apply();
  });
});