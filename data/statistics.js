/* global require, module, console */
var Client = require('./index.js'),
    Q = require('q'),
    strftime = require('strftime');

function save(item) {

  if(!item || !item.type || !item.date || !item.clientKey) {
    return console.log('An invalid item was passed to save.');
  }
  
  switch(item.type.toLowerCase()) {
    case 'search':
      return saveSearch(item);
    case 'performance':
      return savePerformance(item);
    case 'performance':
      return savePerformance(item);
    default:
      return console.log('An invalid type was supplied: ' + item.type.toLowerCase());
  }
}

function saveSearch(item) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };
    
    var opts = {
      date: new Date(),
      type: item.type || '',
      keyword: item.keyword || ''
    };

    var updateHours = require('./statistics/search/hours');
    var updateDays = require('./statistics/search/days');
    var updateKeywords = require('./statistics/search/keywords');

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
      console.log('All updates done, closing database');
      db.close();
    });  
  });
}

function savePerformance(item) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };
    
    var doc = {
      date: item.date,
      cpuUsage: item.cpuUsage,
      availableMemory: item.availableMemory,
      totalMemory: item.totalMemory,
      memoryUsage: item.memoryUsage
    };
    
    var update = {$push: { 'updates': doc }};

    var collection = db.collection('actions');
    collection.update({ date: strftime('%Y-%m-%d', item.date), clientKey: item.clientKey }, update, { upsert: true, safe: true }, function(err, docs) {
      if(err) {
        console.log('Failed updating performance');
        return;
      }
      else
        console.log('Updated performance');
      db.close();
    });
  });
}

module.exports.save = save;
module.exports.saveSearch = saveSearch;