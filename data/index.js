/*global module, require, process */
var MongoClient = require('mongodb').MongoClient;

module.exports = function(callback) {
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    console.log('Connected to database!');
    callback(err, db);
  });
};