/* global require, module */
/*jshint indent:2 */

var clientKeys = require('../data/clientkeys');

module.exports = function(app, io) {
  app.get('/clientkeys/', function (req, res) {
    var body = req.body;
    if(!body) {
      return;
    }

    clientKeys.list().then(function(docs) {
      res.json(docs);
      res.end();
    });    
  });
};