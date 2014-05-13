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
    case 'search': // Obsolete type, can probably be removed in a few months
      saveSearch(item, done);
      break;
    case 'performance':
      savePerformance(item, done);
      break;
    case 'dataminerstats':
      saveMinerStats(item, done);
      break;
    case 'reindexstats':
      saveReindexStats(item, done);
      break;
    case 'electronicmedialoan':
      saveElectronicMediaLoan(item, done);
      break;
    case 'reservationadded':
    case 'reservationremoved':
      saveReservation(item, done);
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
      type: item.type,
      keyword: item.keyword || ''
    };

    var updateHours = require('./statistics/actions/hours');
    var updateDays = require('./statistics/actions/days');
    var updateKeywords = require('./statistics/search/keywords');

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
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

    var date = dateHelpers.removeSeconds(dateHelpers.nextFiveMinute(new Date(item.timeStamp)));

    var query = { date: strftime('%Y-%m-%d', item.date), clientKey: item.clientKey };

    var doc = {
      date: date,
      cpuUsage: item.cpuUsage,
      availableMemory: item.availableMemory,
      totalMemory: item.totalMemory,
      memoryUsage: item.memoryUsage
    };

    var update = { $pull: { stats: { date: date } } };

    var collection = db.collection('performance');
    collection.update(query, update, { upsert: false, safe: true }, function(err, docs) {
      if(err) {
        console.log('Failed pulling old data from performance');
        return;
      }
      
      update = { $push: { stats: doc } };
      
      collection.update(query, update, { upsert: true, safe: true }, function(err, docs) {
        if(err) {
          console.log('Failed updating performance');
          return;
        }

        db.close();
        done.resolve();
      });
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
        console.log('Failed pulling old data from dataminerstats');
        return;
      }
      
      update = { $push: { stats: doc } };
      
      collection.update(query, update, { upsert: true, safe: true }, function(err, docs) {
        if(err) {
          console.log('Failed updating dataminerstats');
          return;
        }

        db.close();
        done.resolve();
      });
    });
  });
}

function saveReindexStats(item, done) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };

    var date = dateHelpers.removeSeconds(dateHelpers.nextFiveMinute(new Date(item.timeStamp)));

    var query = { date: strftime('%Y-%m-%d', item.date), clientKey: item.clientKey };

    var doc = {
      date: date,
      totalProcessed : item.totalProcessed,
      pageSize: item.pageSize,
      lastId: item.lastId
    };

    var update = { $pull: { stats: { date: date } } };

    var collection = db.collection('reindexstats');
    collection.update(query, update, { upsert: false, safe: true }, function(err, docs) {
      if(err) {
        console.log('Failed pulling old data from reindexstats');
        return;
      }
      
      update = { $push: { stats: doc } };
      
      collection.update(query, update, { upsert: true, safe: true }, function(err, docs) {
        if(err) {
          console.log('Failed updating reindexstats');
          return;
        }

        db.close();
        done.resolve();
      });
    });
  });
}

function saveElectronicMediaLoan(item, done) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };

    var opts = {
      date: new Date(item.timeStamp),
      type: item.type
    };

    var updateHours = require('./statistics/actions/hours');
    var updateDays = require('./statistics/actions/days');
    
    // TODO: Save title and ISBN somewhere as well

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
      db.close();
      done.resolve();
    });  
  });
}

function saveReservation(item, done) {
  Client(function(err, db) {
    if(err)
      throw err;

    item = item || { };

    var opts = {
      date: new Date(item.timeStamp),
      type: item.type
    };

    var updateHours = require('./statistics/actions/hours');
    var updateDays = require('./statistics/actions/days');
    
    // TODO: Save title and ISBN somewhere as well

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
      db.close();
      done.resolve();
    });  
  });
}

module.exports.save = save;
module.exports.saveSearch = saveSearch;
module.exports.savePerformance = savePerformance;
module.exports.saveMinerStats = saveMinerStats;
module.exports.saveReindexStats = saveReindexStats;
module.exports.saveElectronicMediaLoan = saveElectronicMediaLoan;
module.exports.saveReservation = saveReservation;