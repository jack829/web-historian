var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var file1 = archive.paths.siteAssets + asset;
  fs.readFile(file1, function(err, data) {
    if(err) {
      var file2 = archive.paths.archivedSites + asset;
      fs.readFile(file2, function(err, data) {
        if(err) {
          callback ? callback() : sendResponse(res, "Not Found", 404);
        } else {
          exports.sendResponse(res, data, 200);
        }
      });
    } else {
      exports.sendResponse(res, data, 200);
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.sendResponse = function(res, obj, statusCode) {
  res.writeHead(statusCode, headers);
  res.end(obj);
}

exports.sendRedirect = function(res, url) {
  res.writeHead(302, {Location: url});
  res.end();
}

exports.collectData = function(req, cb) {
  var tmp = "";
  req.on('data', function(chunk) {
    tmp += chunk;
  });

  req.on('end', function() {
    cb(tmp);
  });
}

