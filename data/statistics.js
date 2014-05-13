/* global require, module, console, JSON */
/* jshint indent:2 */
var Client = require('./index'),
    dateHelpers = require('./../helpers/date'),
    Q = require('q'),
    strftime = require('strftime');

function save(item) {
  var done = Q.defer();
  if(!item || !item.type || !item.timeStamp || !item.clientKey) {
    console.log('An invalid item was passed to save.');
    done.reject('An invalid item was passed to save.');
  }

  switch(item.type.toLowerCase()) {
    case 'worksetsearch':
    case 'worksearch':
    case 'search':
      saveSearch(item, done);
      break;
    case 'performance':
      savePerformance(item, done);
      break;
    case 'dataminerstats':
      saveMinerStats(item, done);
      break;
    default:
      console.log('An invalid type was supplied: ' + item.type.toLowerCase() + '\n' + JSON.stringify(item));
  }
  return done.promise;
}

function saveSearch(item, done) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };

    var opts = {
      date: new Date(item.timeStamp),
      type: item.type || '',
      keyword: item.keyword || ''
    };

    var updateHours = require('./statistics/search/hours');
    var updateDays = require('./statistics/search/days');
    var updateKeywords = require('./statistics/search/keywords');

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
      console.log('All updates done, closing database');
      db.close();
      done.resolve();
    });  
  });
}

function savePerformance(item, done) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };

    var doc = {
      date: new Date(item.timeStamp),
      cpuUsage: item.cpuUsage,
      availableMemory: item.availableMemory,
      totalMemory: item.totalMemory,
      memoryUsage: item.memoryUsage
    };

    var update = {$push: { 'updates': doc }};

    var collection = db.collection('performance');
    collection.update({ date: strftime('%Y-%m-%d', item.date), clientKey: item.clientKey }, update, { upsert: true, safe: true }, function(err, docs) {
      if(err) {
        console.log('Failed updating performance');
        return;
      }
      else {
        console.log('Updated performance');
      }

      db.close();
      done.resolve();
    });
  });
}

// To get the last 20 stats: db.dataminerstats.find({}, { stats: { $slice: -20 } } )
function saveMinerStats(item, done) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };

    var date = dateHelpers.removeSeconds(dateHelpers.nextFiveMinute(new Date(item.timeStamp)));

    var query = { date: strftime('%Y-%m-%d', item.date), clientKey: item.clientKey, catalogId: item.catalogId, catalogName: item.catalogName, minerName: item.minerName };

    var doc = {
      date: date,
      lastScan: item.lastScan,
      scannedWorksPerMinute: item.scannedWorksPerMinute,
      lastScannedId: item.lastScannedId
    };

    var update = { $pull: { stats: { date: date } } };

    var collection = db.collection('dataminerstats');
    collection.update(query, update, { upsert: false, safe: true }, function(err, docs) {
      if(err) {
        console.log('Failed updating pulling old data from dataminerstats');
        return;
      }
      else {
        console.log('Pulled old data from dataminerstats');
      }
      
      update = { $push: { stats: doc } };
      
      collection.update(query, update, { upsert: true, safe: true }, function(err, docs) {
        if(err) {
          console.log('Failed updating dataminerstats');
          return;
        }
        else {
          console.log('Updated dataminerstats');
        }

        db.close();
        done.resolve();
      });
    });
  });
}

module.exports.save = save;
module.exports.saveSearch = saveSearch;
module.exports.savePerformance = savePerformance;
module.exports.saveMinerStats = saveMinerStats;