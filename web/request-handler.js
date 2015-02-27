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
      console.log(newUrl);
      archive.isUrlInList(newUrl, function(exist) {
        if (exist){
          archive.isUrlArchived(newUrl, function(isArchived) {
            if(isArchived) {
              utils.sendRedirect(res, '/' + newUrl);
            } else {
              utils.sendRedirect(res, '/loading.html');
            }
          })
        } else {
          archive.addUrlToList(newUrl, function() {
            utils.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

