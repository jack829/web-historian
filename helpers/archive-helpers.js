var fs = require('fs');
var path = require('path');
var _ = require('underscore');


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
    for (var i = urlArray.length-1; i >=0; i--) {
      if (urlArray[i] === url) {
        callback(true);
      }
    }
    callback(false);
  });
};

exports.addUrlToList = function(url, callback){
  var name = url + "\n";
  fs.writeFile(paths.list, name, function(err) {
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

exports.downloadUrls = function(){
};
