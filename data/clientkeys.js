/* global require, module, console */
var Client = require('./index.js'),
    ObjectID = require('mongodb').ObjectID,
    Q = require('q');

module.exports.getByKey = function(options) {
  var deferred = Q.defer();
  Client(function(err, db) {
    if(err)
      throw err;

    options = options || { };

    var collection = db.collection('clientKeys');
    collection.findOne({clientKey: options.clientKey}, function(err, doc) {
      if(err) {
        console.log('Failed retrieveing document');
        deferred.reject(err);
        return;
      }
      deferred.resolve(doc);
      db.close();
    });
  });
  
  return deferred.promise;
};

module.exports.create = function(options) {
  var deferred = Q.defer();
  Client(function(err, db) {
    if(err)
      throw err;

    options = options || { };
    
    var opts = {
      clientKey: new ObjectID(Math.random() * 1000000000).toHexString(),
      name: options.name || '',
      latitude: options.latitude || 0,
      longitude: options.longitude || 0
    };

    var collection = db.collection('clientKeys');
    collection.insert([opts], function(err, doc) {
      if(err) {
        console.log('Failed creating document');
        deferred.reject(err);
        return;
      }
      deferred.resolve(doc);
      db.close();
    });
  });
  
  return deferred.promise;
};

module.exports.list = function() {
  var deferred = Q.defer();
  Client(function(err, db) {
    if(err)
      throw err;

    var collection = db.collection('clientKeys');
    collection.find(function(err, docs) {
      if(err) {
        console.log('Failed retrieveing documents');
        deferred.reject(err);
        return;
      }
      deferred.resolve(docs);
      db.close();
    });
  });
  
  return deferred.promise;
};