/* global require, module, console */
/* jshint indent:2 */

var statistics = require('../data/statistics');
var clientInstances = require('../data/client-instances');
var promiseFor = require('../helpers/promise-for');
var Q = require('q');

module.exports = function(app, io) {
  app.put('/statistics/collect', function (req, res) {
    var body = req.body;
    if(!body) {
      return;
    }

    if(!Array.isArray(body)) {
      console.log('Legacy, non-array, message recieved.');
      console.log(body);
      body = [body];
    }

    promiseFor(body, function(idx, item) {
      var done = Q.defer();

      var clientKey = item.clientKey;
      clientInstances.getByKey({clientKey: clientKey}).then(function(client) {
        if(!client) {
          console.log('Invalid clientKey specified: ' + clientKey);
          return done.reject('Invalid clientKey specified: ' + clientKey);
        }

        statistics.save(item).then(function() {
          if(!!item.type) {
            var type = item.type.toLowerCase();
            if(type.indexOf('search') !== -1) {
              var search = {
                'keywords': item.freeText,
                'lat': client.latitude,
                'lon': client.longitude
              };

              if(!!search && search.keywords.length > 0)
                io.sockets.emit('search', search);  // No need to emit empty keywords
              
            } else if(type === 'performance') {
              var perf = {
                clientKey: item.clientKey,
                cpuUsage: item.cpuUsage,
                availableMemory: item.availableMemory,
                totalMemory: item.totalMemory,
                memoryUsage: item.memoryUsage
              };

              io.sockets.emit(type, perf);
              
            } else if(type === 'dataminerstats') {
              var miner = {
                clientKey: item.clientKey,
                minerName: item.minerName,
                catalogName: item.catalogName,
                catalogId: item.catalogId,
                scannedWorksPerMinute: item.scannedWorksPerMinute,
                lastScannedId: item.lastScannedId              
              };
              
              io.sockets.emit(type, miner);
              
            } else if(type === 'reindexstats') {
              var reindex = {
                totalProcessed : item.totalProcessed,
                pageSize: item.pageSize,
                lastId: item.lastId
              };
              
              io.sockets.emit(type, reindex);
              
            }
            done.resolve();
          }
        });
      });

      return done.promise;
    }).then(function(results) {
      if(results.failures.length > 0) {
        console.log('Failed items: ' + results.failures.length + ' (out of a total of ' + (results.success.length + results.failures.length) + ' items)'); 
      }
      res.end();
    });
  });
};