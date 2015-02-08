/* global require, module */
/*jshint indent:2 */

var clientInstances = require('../data/client-instances'),
    path = require('path');

module.exports = function(app, io) {
  app.get('/*', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'));
  });
};