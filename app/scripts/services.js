angular.module('incredible.services', [])

.factory('nodeModService', function() {
  return {
    qiniu: require('qiniu'),
    fs: require('fs'),
    nedb: require('nedb'),
    'nw.gui': require('nw.gui')
  }
})


.factory('uploadService', function(nodeModService, settingService, recordService) {
  var qiniu = require('qiniu'),
    fs = require('fs');

  function getUploadToken(bucketName) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketName);
    return putPolicy.token();
  }

  function uploadFile(localFile, key, bucketName) {
    settingService.get(function(setting) {
      var bucketName = setting.bucketName,
        extra = new qiniu.io.PutExtra(),
        token;
      qiniu.conf.ACCESS_KEY = setting.accessKey;
      qiniu.conf.SECRET_KEY = setting.secretKey;
      token = getUploadToken(bucketName);

      qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {
        if(!err) {
          var url = 'http://' + bucketName + '.qiniudn.com/' + ret.key;
          var gui = require('nw.gui'),
          clipboard = gui.Clipboard.get();
          clipboard.set(url);
          alert('Image url copied to clipboard.');
          recordService.insert({
            url: url
          });
        } else {
          console.log(err);
        }
      });
    });
  }



  return {
    uploadFile: uploadFile
  };
})


.factory('dbService', function() {
  var DataStore = require('nedb'),
    db = {
      setting: new DataStore({ filename: 'data/setting.nedb', autoload: true }),
      record: new DataStore({ filename: 'data/record.nedb', autoload: true })
    };

  return db;
})


.service('settingService', function(dbService) {
  var db = dbService.setting;
  this.get = function(done) {
    db.findOne({}, function(err, doc) {
      done(doc);
    });
  };
  this.save = function(setting, done) {
    console.log(setting);
    db.remove({}, { multi: true }, function(err, numRemoved) {
      db.insert(setting, function(err, newDoc) {
        done(numRemoved);
      });
    });
  };
})


.service('recordService', function(dbService, $rootScope) {
  var db = dbService.record;
  this.getAll = function(done) {
    db.find({}).sort({ createdAt: -1 }).exec(function(err, docs) {
      done(docs);
    });
  };
  this.remove = function(doc, done) {
    done = done ? done : function() {};
    db.remove(doc, function(err, numRemoved) {
      done(numRemoved);
      $rootScope.$broadcast('recordService:recordsChanged');
    });
  };
  this.insert = function(doc, done) {
    done = done ? done : function() {};
    doc.createdAt = Date.now();
    db.insert(doc, function(err, doc) {
      done(doc);
      $rootScope.$broadcast('recordService:recordsChanged')
    });
  };
});