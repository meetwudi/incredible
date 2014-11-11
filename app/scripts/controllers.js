angular.module('incredible.controllers', [])

.controller('SettingController', function($scope, settingService) {
  $scope.setting = {};
  $scope.applySetting = function() {
    settingService.save($scope.setting, function() {
      alert('Your setting have been saved.');
    });
  };
  settingService.get(function(err, setting) {
    $scope.setting = setting;
    $scope.$apply();
  });
})

.controller('UploadController', function($scope, uploadService) {
  var _ = require('underscore');
  $scope.upload = {};
  $scope.upload.pendingFiles = [];
  $scope.$on('inDropArea:newfile', function(e, file) {
    $scope.upload.pendingFiles.push(file);
    $scope.$apply();
  });
  $scope.upload.doUpload = function() {
    var async = require('async'), 
      uploadFile = uploadService.uploadFile;
    $scope.upload.uploading = true;
    $scope.upload.uploadTotal = $scope.upload.pendingFiles.length;
    $scope.upload.uploadedTotal = 0;
    async.mapSeries($scope.upload.pendingFiles, uploadFile, function(err) {
      $scope.upload.uploading = false;
      $scope.$apply();
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
    $scope.$apply();
  });
})


.controller('ManageController', function($scope, recordService) {
  $scope.manage = {};
  $scope.manage.records = [];
  $scope.manage.visibleRecords = [];
  $scope.manage.currentPage = 1;
  $scope.manage.itemsPerPage = 24;
  $scope.manage.refresh = function() {
    recordService.getAll(function(err, records) {
      $scope.manage.records = records;
      $scope.manage.updateVisibleRecords();
      $scope.$apply();
    });
  };
  $scope.manage.updateVisibleRecords = function() {
    var currentPage = $scope.manage.currentPage,
      itemsPerPage = $scope.manage.itemsPerPage,
      firstItemIdx = itemsPerPage * (currentPage - 1);
    $scope.manage.visibleRecords = $scope.manage.records.slice(firstItemIdx, firstItemIdx + itemsPerPage); 
  };
  $scope.manage.refresh();
  $scope.$on('recordService:recordsChanged', $scope.manage.refresh);
})


.controller('PresetManageController', function($scope) {
  
});