
$(function() {





  // Settings

  if (localStorage.ACCESS_KEY || localStorage.SECRET_KEY || localStorage.BUCKET_NAME) {
    qiniu.conf.ACCESS_KEY = localStorage.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = localStorage.SECRET_KEY;
    $('#access_key').val(localStorage.ACCESS_KEY);
    $('#secret_key').val(localStorage.SECRET_KEY);
    $('#bucket_name').val(localStorage.BUCKET_NAME);
  }

  // Copy & Paste hotkeys
  

});
