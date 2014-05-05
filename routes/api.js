/* global require, module */
/*jshint indent:2 */

var clientInstances = require('../data/client-instances');

module.exports = function(app, io) {
  app.get('/api/instances/', function (req, res) {
    var body = req.body;
    if(!body) {
      return;
    }

    clientInstances.list().then(function(docs) {
      res.json(docs);
    });    
  });
  
  app.post('/api/instances/', function (req, res) {
    var body = req.body;
    if(!body) {
      return;
    }
  });
};