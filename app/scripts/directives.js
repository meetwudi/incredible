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
          file.key = Date.now() + '-' + sha1(file.name) + path.extname(file.name);
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
});