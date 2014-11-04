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
})

.controller('RecordController', function($scope, recordService) {
  $scope.records = [];
  $scope.refreshRecords = function() {
    recordService.getAll(function(records) {
      $scope.records = records;
      $scope.$apply();
    });
  };
  $scope.$on('recordService:recordsChanged', $scope.refreshRecords);
  $scope.refreshRecords();
});