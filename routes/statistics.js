/* global require, module, console */
/* jshint indent:2 */

var statistics = require('../data/statistics');
var clientKeys = require('../data/clientkeys');
var promiseFor = require('../helpers/promise-for');
var Q = require('q');

module.exports = function(app, io) {
  app.post('/recieve', function (req, res) { // Obsolete, just kept since we have an implementation in production using it still
    var body = req.body;
    if(!body) {
      return;
    }

    var obj = {
      'keywords': body.keywords,
      'lat': body.lat,
      'lon': body.lon
    };

    io.sockets.emit('search', obj);
    res.end();
  });
  
  app.put('/statistics/collect', function (req, res) {
    var body = req.body;
    if(!body) {
      return;
    }
    
    if(!Array.isArray(body)) {
      console.log('Legacy, non-array, message recieved.');
      body = [body];
    }
    promiseFor(body, function(idx, item) {
      var done = Q.defer();

      var clientKey = item.clientKey;
      clientKeys.getByKey({clientKey: clientKey}).then(function(client) {
        if(!client) {
          console.log('Invalid clientKey specified: ' + clientKey);
          return done.reject('Invalid clientKey specified: ' + clientKey);
        }
        /*
        var opts = {
          type: 'search',
          keyword: body.keywords
        };

        statistics.save(opts);

        var obj = {
          'keywords': body.keywords,
          'lat': client.latitude,
          'lon': client.longitude
        };

        io.sockets.emit('search', obj);
        */
        done.resolve();
      });
      
      
      return done.promise;
    }).then(function(results) {
      console.log('Successfull items: ' + results.success.length); 
      console.log('Failed items: ' + results.failures.length); 
      res.end();
    });
  });
};