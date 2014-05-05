/* global require, module */
/* jshint indent:2 */

var statistics = require('../data/statistics');
var clientInstances = require('../data/client-instances');

module.exports = function(app, io) {
  app.get('/dashboard', function (req, res) {
    clientInstances.list().then(function(docs) {
      res.render('dashboard', { title: 'Dashboard', instances: docs });
    });
  });
};