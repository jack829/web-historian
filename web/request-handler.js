var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var utils = require('./http-helpers.js');
var fs = require('fs');
var url = require('url');

exports.handleRequest = function (req, res) {
  if( req.method === "GET" ){
    var part = url.parse(req.url);
    var urlPath = part.pathname === '/' ? '/index.html' : part.pathname;
    utils.serveAssets(res, urlPath, function() {
      archive.isUrlInList(urlPath.slice(1), function(isIn) {
        if(isIn) {
          utils.sendRedirect(res, '/loading.html');
        } else {
          utils.sendResponse(res, "Not Found", 404);
        }
      })
    });
  }

  if( req.method === "POST" ){
    utils.collectData(req, function(data) {
      var newUrl = data.slice(4);
      archive.isUrlInList(newUrl, function(exist) {
        if (exist === true){

          archive.isURLArchived(newUrl, function(isArchived) {
            if(isArchived) {
              utils.sendRedirect(res, '/' + newUrl);
            }

            if(!isArchived) {
              utils.sendRedirect(res, '/loading.html');
            }
          });
        }

        if(exist === false) {
          console.log(exist);
          archive.addUrlToList(newUrl, function() {
            console.log(" should implement me");
            utils.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

