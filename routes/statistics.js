/* global require, module */
/*jshint indent:2 */

var statistics = require('../data/statistics');
var clientKeys = require('../data/clientkeys');

module.exports = function(app, io) {
  app.post('/recieve', function (req, res) { // Obsolete, just kept since we have an implementation in production using it still
    var body = req.body;
    if(!body) {
      return;
    }

    var opts = {
      type: 'search',
      keyword: body.keywords
    };

    statistics.save(opts);

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
    
    var clientKey = body.clientKey;
    clientKeys.getByKey({clientKey: clientKey}).then(function(client) {
      if(!client) {
        res.send(400, 'Invalid clientKey specified');
        res.end();
      }
      
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
      res.end();
    });
  });
};