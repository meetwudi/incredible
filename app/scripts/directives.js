angular.module('incredible.directives', [])

.directive('inDropFile', function(uploadService) {
  return {
    link: function(scope, ele, attrs) {
      $(window).bind('dragover drop', function(e) {
        e.preventDefault();
        return false;
      });
      ele.bind('dragenter', function(e) {
        $(this).addClass('drop-area--hover');
      });
      ele.bind('drop dragleave', function(e) {
        $(this).removeClass('drop-area--hover');
      });
      ele.bind('drop', function(e) {
        e.preventDefault();
        // Drag & Drop happens here
        var files = [].slice.call(e.originalEvent.dataTransfer.files);
        files.forEach(function(file) {
          var key = Date.now() + file.name,
            path = file.path;
          uploadService.uploadFile(path, key);
        });
        return false;
      });
    }
  }
})

.directive('inPastable', function(nodeModService) {
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
});