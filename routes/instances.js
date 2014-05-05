/* global require, module */
/* jshint indent:2 */

var clientInstances = require('../data/client-instances');

module.exports = function(app, io) {
  app.get('/instances', function (req, res) {
    clientInstances.list().then(function(docs) {
      res.render('instances', { title: 'OLA Instances', instances: docs });
    });
  });
  
  app.get('/instances/add', function (req, res) {
    res.render('instances/add', { title: 'Add instance' });
  });
  
  app.post('/instances/add', function (req, res) {
    console.log(req.body);
    clientInstances.create({ name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude }).then(function() {
      res.render('instances/add', { title: 'Add instance', success: true, name: req.body.name });  
    });
  });
  
  app.get('/instances/edit/:key', function (req, res) {
    console.log(req.params.key);
    clientInstances.getByKey({ clientKey: req.params.key }).then(function(doc) {
      res.render('instances/edit', { title: 'Edit instance', name: doc.name, latitude: doc.latitude, longitude: doc.longitude });  
    });
  });
  
  app.post('/instances/edit/:key', function (req, res) {
    console.log(req.params.key);
    clientInstances.save({ clientKey: req.params.key, name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude }).then(function() {
      res.render('instances/edit', { title: 'Edit instance', success: true, name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude });  
    });
  });
};