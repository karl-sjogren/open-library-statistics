/* global require, module */
/* jshint indent:2 */

var clientInstances = require('../data/client-instances');

module.exports = function(app, io) {
  app.get('/instances/add', function (req, res) {
    res.render('instances/add', { title: 'Add instance' });
  });
  app.post('/instances/add', function (req, res) {
    console.log(req.body);
    clientInstances.create({ name: req.body.name }).then(function() {
      res.render('instances/add', { title: 'Add instance', success: true, name: req.body.name });  
    });
  });
};