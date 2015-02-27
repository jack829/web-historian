var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.paths = paths;

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  var result = '';
  var file = fs.createReadStream(paths.list);
  file.on('data', function(chunk) {
    result += chunk;
  });
  file.on('end', function(){
    sol = result.split('\n');
    callback(sol);
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(urlArray){
    var done = false;
    for (var i = urlArray.length-1; i >=0; i--) {
      if (urlArray[i] === url) {
        done = true;
        callback(true);
      }
    }
    if(done === false){
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback){
  console.log("addlist");
  var name = url + "\n";
  fs.appendFile(paths.list, name, function(err) {
    if( err ) throw err;
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  var newUrl = '/' + url;
  newUrl = path.join(paths.archivedSites, newUrl);
  fs.exists(newUrl, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(urls){
  _.each(urls, function(url) {
    exports.isURLArchived(url, function(isArchived){
      if(!isArchived) {
        var option = {
          'host': url
        };
        http.get(option, function(res) {
          var data = '';

          res.on('data', function(chunk) {
            data += chunk;
          });

          res.on('end', function() {
            var destination = paths.archivedSites + '/' + url;
            fs.writeFile(destination, data, function(err) {
              if (err) throw err;
              console.log('done');
            })
          });
        });
      }
    });
  });
};
