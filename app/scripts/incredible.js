
$(function() {
  // Qiniu SDK & Helpers
  var qiniu = require('qiniu'),
    fs = require('fs');
  function getUploadToken(bucketName) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketName);
    return putPolicy.token();
  }
  function uploadFile(localFile, key) {
    var extra = new qiniu.io.PutExtra(),
      token = getUploadToken($('#bucket_name').val());

    qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {
      if(!err) {
        var gui = require('nw.gui'),
        clipboard = gui.Clipboard.get();
        clipboard.set('http://' + $('#bucket_name').val() + '.qiniudn.com/' + ret.key);
        alert('Image url copied to clipboard.');
      } else {
        console.log(err);
      }
    });
  }

  // Drag & Drop area behaviour
  $(window).bind('dragover drop', function(e) {
    e.preventDefault();
    return false;
  });
  $dropArea = $('.J_drop-area');
  $dropArea.bind('dragenter', function(e) {
    $(this).addClass('drop-area--hover');
  });
  $dropArea.bind('drop dragleave', function(e) {
    $(this).removeClass('drop-area--hover');
  });
  $dropArea.bind('drop', function(e) {
    e.preventDefault();
    // Drag & Drop happens here
    var files = [].slice.call(e.originalEvent.dataTransfer.files);
    files.forEach(function(file) {
      var key = Date.now() + file.name,
        path = file.path;
      uploadFile(path, key);
    });
    return false;
  });


  // Settings
  $('.J_apply-key').bind('click', function(e) {
    e.preventDefault();
    localStorage.ACCESS_KEY = qiniu.conf.ACCESS_KEY = $('#access_key').val();
    localStorage.SECRET_KEY = qiniu.conf.SECRET_KEY = $('#secret_key').val();
    localStorage.BUCKET_NAME = $('#bucket_name').val();
  });

  if (localStorage.ACCESS_KEY || localStorage.SECRET_KEY || localStorage.BUCKET_NAME) {
    qiniu.conf.ACCESS_KEY = localStorage.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = localStorage.SECRET_KEY;
    $('#access_key').val(localStorage.ACCESS_KEY);
    $('#secret_key').val(localStorage.SECRET_KEY);
    $('#bucket_name').val(localStorage.BUCKET_NAME);
  }

  // Copy & Paste hotkeys
  
  $(document).bind('keydown', 'ctrl+v', function(e) {
    var gui = require('nw.gui'),
      clipboard = gui.Clipboard.get();
    var text = clipboard.get('text');
    $(':focus').val(text);
  });
});
