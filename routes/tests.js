/* global require, module, process, console */
/* jshint indent:2 */

var clientInstances = require('../data/client-instances');

module.exports = function(app, io) {
  app.get('/tests/barchart', function (req, res) {
    res.render('tests/barchart', { title: 'OLA Instances' });
  });
};