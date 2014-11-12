angular.module('incredible.directives', [])

.directive('inDropArea', function() {
  return {
    link: function(scope, ele, attrs) {
      $(window).bind('dragover drop', function(e) {
        e.preventDefault();
        return false;
      });
      // ele.bind('dragenter', function(e) {
      //   $(this).addClass('in-drop-area--hover');
      // });
      // ele.bind('drop dragleave', function(e) {
      //   $(this).removeClass('in-drop-area--hover');
      // });
      ele.bind('drop', function(e) {
        e.preventDefault();
        // Drag & Drop happens here
        var sha1 = require('sha1'),
          path = require('path');
        var files = [].slice.call(e.originalEvent.dataTransfer.files);
        files.forEach(function(file) {
          // 计算文件的Key
          file.key = sha1(Date.now() + '') + '-' + sha1(file.name) + path.extname(file.name);
          scope.$broadcast('inDropArea:newfile', file);
        });
        return false;
      });
    }
  }
})

.directive('inPendingFile', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'scripts/directive-templates/in-pending-file.html',
    link: function(scope, ele, attrs) {
      
    }
  }
})

.directive('inPastable', function() {
  return {
    scope: {},
    require: 'ngModel',
    link: function(scope, ele, attrs, ngModelController) {
      var gui = require('nw.gui'),
          clipboard = gui.Clipboard.get();
      $(ele).bind('keyup', 'ctrl+v', function(e) {
        ngModelController.$setViewValue(clipboard.get('text'));
        ngModelController.$render();
        // $(ele).val(clipboard.get('text'));
      });
    }
  }
})


.directive('inRecord', function() {
  return {
    templateUrl: 'scripts/directive-templates/in-record.html'
  }
})


.directive('inSettingForm', function(presetService) {
  return {
    templateUrl: 'scripts/directive-templates/in-setting-form.html'
  }
})


.directive('inNav', function($route) {
  return {
    templateUrl: 'scripts/directive-templates/in-nav.html',
    link: function(scope, ele, attrs) {
      scope.nav = {};
      scope.$on('$routeChangeSuccess', function() {
        scope.nav.currentController = $route.current.$$route.controller;
      });
    }
  }
})


.directive('inCopy', function(presetUrlService) {
  return {
    scope: {
      'inCopyProps': '@',
      'record': '='
    },
    link: function(scope, ele, attrs) {
      var gui = require('nw.gui'),
        clipboard = gui.Clipboard.get();
      ele.bind('click', function() {
        var props = JSON.parse(scope.inCopyProps),
          url = presetUrlService.getUrl(scope.record.url, props);
        clipboard.set(url);
      });
    }
  }
})


.directive('inPresetManage', function() {
  return {
    scope: {},
    templateUrl: 'scripts/directive-templates/in-preset-manage.html'
  }
})


.directive('inPreset', function(presetService) {
  return {
    restrict: 'A',
    controller: function($scope, $modal) {
      var _ = require('underscore');
      $scope.preset = {};
      $scope.preset.removePreset = function() {
        var idx = _.indexOf($scope.presetManage.presets, $scope.item);
        $scope.presetManage.presets.splice(idx, 1);
        presetService.remove($scope.item);
      };
      $scope.preset.editPreset = function() {
        $modal.open({
          templateUrl: 'scripts/templates/components/preset-editor.html',
          scope: $scope,
          controller: 'PresetEditorController'
        });
      };
    }
  }
});