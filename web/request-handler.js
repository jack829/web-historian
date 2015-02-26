var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var headers = require('./http-helpers.js');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  var url = req.url;

  if( req.method === "GET" ){
    url = path.join(archive.paths.archivedSites, url);
    if( req.url !== '/' && archive.isURLArchived(url) ) {
      readContent(url, res);
    } else {
      if ( req.url !== '/' ){
        res.writeHead(404, headers);
        res.end();
      } else {
        var asset = path.join(archive.paths.siteAssets, '/index.html');
        readContent(asset, res);
      }
    }
  }

  if( req.method === "POST" ){
    var newUrl = "";

    req.on('data', function(chunk) {
      newUrl += chunk;
    });

    req.on('end', function(){
      if( !archive.isUrlInList(newUrl) ) {
        archive.addUrlToList(newUrl, function() {
          res.writeHead(302, headers);
          res.end();
        });
      }
    });
  }
};

var readContent = function(url, res) {
  fs.readFile(url, function(err, data) {
    if(err) {
      throw err;
    }
    res.writeHead(200, headers);
    res.write(data);
    res.end();
  });
};

