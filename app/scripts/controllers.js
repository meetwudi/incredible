angular.module('incredible.controllers', [])

.controller('SettingController', function($scope, $rootScope, settingService) {
  $scope.setting = {};
  $scope.applySetting = function() {
    settingService.save($scope.setting, function() {
      $rootScope.$broadcast('inGlobalNotification:newNotification', {
        type: 'success',
        content: '设置保存成功'
      });
    });
  };
  settingService.get(function(err, setting) {
    $scope.setting = setting;
    $scope.$digest();
  });
})


.controller('UploadController', function($scope, uploadService) {
  var _ = require('underscore');
  $scope.upload = {};
  $scope.upload.pendingFiles = [];
  $scope.$on('inDropArea:newfile', function(e, file) {
    $scope.upload.pendingFiles.push(file);
    $scope.$digest();
  });
  $scope.upload.doUpload = function() {
    var async = require('async'), 
      uploadFile = uploadService.uploadFile;
    $scope.upload.uploading = true;
    $scope.upload.uploadTotal = $scope.upload.pendingFiles.length;
    $scope.upload.uploadedTotal = 0;
    async.mapSeries($scope.upload.pendingFiles, uploadFile, function(err) {
      $scope.upload.uploading = false;
      $scope.$digest();
    });
  };
  $scope.upload.doReset = function() {
    $scope.upload.pendingFiles = [];
  };
  $scope.$on('uploadService:fileUploaded', function(e, uploadedFile) {
    $scope.upload.pendingFiles = _.filter($scope.upload.pendingFiles, function(file) {
      return file.key != uploadedFile.key;
    });
    $scope.upload.uploadedTotal ++;
    $scope.$digest();
  });
  $scope.$on('uploadService:uploadSuspended', function(e) {
    $scope.upload.uploading = false;
  });
})


.controller('ManageController', function($scope, recordService, presetService) {
  $scope.manage = {};
  $scope.manage.records = [];
  $scope.manage.visibleRecords = [];
  $scope.manage.currentPage = 1;
  $scope.manage.itemsPerPage = 24;
  $scope.manage.refreshRecords = function() {
    recordService.getAll(function(err, records) {
      $scope.manage.records = records;
      $scope.manage.updateVisibleRecords();
      $scope.$digest();
    });
  };
  $scope.manage.refreshPresets = function() {
    presetService.getAll(function(err, presets) {
      $scope.manage.presets = presets;
      $scope.$digest();
    });
  };
  $scope.manage.updateVisibleRecords = function() {
    var currentPage = $scope.manage.currentPage,
      itemsPerPage = $scope.manage.itemsPerPage,
      firstItemIdx = itemsPerPage * (currentPage - 1);
    $scope.manage.visibleRecords = $scope.manage.records.slice(firstItemIdx, firstItemIdx + itemsPerPage); 
  };
  $scope.manage.refreshRecords();
  $scope.manage.refreshPresets();
  $scope.$on('recordService:recordsChanged', $scope.manage.refreshRecords);
  $scope.$on('presetService:presetsChanged', $scope.manage.refreshPresets);
})


.controller('PresetManageController', function($scope, presetService, $modal) {
  $scope.presetManage = {};
  $scope.presetManage.refresh = function() {
    presetService.getAll(function(err, presets) {
      $scope.presetManage.presets = presets;
      $scope.$digest();
    });
  };
  $scope.presetManage.newPreset = function() {
    $scope.newItem = presetService.newInstance();
    $modal.open({
      templateUrl: 'scripts/templates/components/preset-editor.html',
      scope: $scope,
      controller: 'PresetEditorController'
    });
  };
  $scope.presetManage.refresh();
  $scope.$on('presetService:presetsChanged', $scope.presetManage.refresh);
})


.controller('PresetEditorController', function($scope, $modalInstance, presetService) {
  $scope.presetEditor = {};
  if (!$scope.item) {
    $scope.item = {};
  }
  $scope.presetEditor.save = function() {
    presetService.save($scope.item, function(err) {
      $modalInstance.close();
    });
  };
  // $scope.presetEditor.output = function() {  console.log($scope); };
});