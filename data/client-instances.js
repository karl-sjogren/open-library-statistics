/* global require, module, console */
/* jshint indent:2 */
var Client = require('./index.js'),
    ObjectID = require('mongodb').ObjectID,
    Q = require('q');

Client(function(err, db) {
  if(err) {
    throw err;
  }

  module.exports.getByKey = function(options) {
    var deferred = Q.defer();

    options = options || { };

    var collection = db.collection('client-instances');
    collection.findOne({clientKey: options.clientKey}, function(err, doc) {
      if(err) {
        console.log('Failed retrieving instance');
        deferred.reject(err);
        return;
      }
      deferred.resolve(doc);
    });


    return deferred.promise;
  };

  module.exports.create = function(options) {
    var deferred = Q.defer();

    options = options || { };

    var opts = {
      clientKey: new ObjectID(Math.random() * 1000000000).toHexString(),
      name: options.name || '',
      latitude: options.latitude || 0,
      longitude: options.longitude || 0
    };

    var collection = db.collection('client-instances');
    collection.insert([opts], function(err, doc) {
      if(err) {
        console.log('Failed retrieving instances');
        deferred.reject(err);
        return;
      }
      deferred.resolve(doc);
    });

    return deferred.promise;
  };

  module.exports.save = function(options) {
    var deferred = Q.defer();

    options = options || { };

    var opts = {
      clientKey: options.clientKey,
      name: options.name,
      latitude: options.latitude || 0,
      longitude: options.longitude || 0
    };

    var collection = db.collection('client-instances');
    collection.update({ clientKey: options.clientKey }, opts, function(err, doc) {
      if(err) {
        console.log('Failed updating instance');
        deferred.reject(err);
        return;
      }
      deferred.resolve(doc);
    });

    return deferred.promise;
  };

  module.exports.list = function() {
    var deferred = Q.defer();

    var collection = db.collection('client-instances');
    collection.find(function(err, docs) {
      if(err) {
        console.log('Failed retrieveing documents');
        deferred.reject(err);
        return;
      }
      docs.toArray(function(err, arr) {

        deferred.resolve(arr);
      });
    });

    return deferred.promise;
  };

  module.exports.getMinersByKey = function(options) {
    var deferred = Q.defer();

    options = options || { };

    var collection = db.collection('dataminerstats');
    collection.aggregate([ 
      { $match : { clientKey : options.clientKey } },
      { "$group": { "_id": { catalogId: "$catalogId", catalogName: "$catalogName", minerName: "$minerName" } } } 
    ], function(err, docs) {
      if(err) {
        console.log('Failed retrieving miners');
        deferred.reject(err);
        return;
      }
      deferred.resolve(docs);
    });

    return deferred.promise;
  };
});