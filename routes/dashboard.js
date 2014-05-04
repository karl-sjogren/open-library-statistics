/* global require, module */
/* jshint indent:2 */

var statistics = require('../data/statistics');
var clientKeys = require('../data/clientkeys');

module.exports = function(app, io) {
  app.get('/dashboard', function (req, res) {
    res.render('dashboard', { title: 'Dashboard' });
  });
};