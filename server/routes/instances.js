/* global require, module, process, console */
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
    clientInstances.create({ name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude }).then(function(docs) {
      res.render('instances/add', { title: 'Add instance', success: true, name: docs[0].name, clientKey: docs[0].clientKey });  
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

  app.get('/instances/dashboard/:key', function (req, res) {
    clientInstances.getByKey({ clientKey: req.params.key }).then(function(instance) {
      clientInstances.getMinersByKey({ clientKey: req.params.key }).then(function(miners) {
        console.log(miners);
        res.render('instances/dashboard', { 
          title: instance.name + ' dashboard', 
          subTitle: instance.clientKey, 
          name: instance.name, 
          latitude: instance.latitude, 
          longitude: instance.longitude, 
          clientKey: instance.clientKey,
          miners: miners,
          googleMapsKey: process.env.GOOGLE_MAPS_KEY 
        });
      });
    });
  });
};