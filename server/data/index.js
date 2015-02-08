/*global module, require, process */
var MongoClient = require('mongodb').MongoClient;

module.exports = function(callback) {
  console.log('Connecting to ' + process.env.MONGOLAB_URI);
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    console.log('Connected to database!');
    callback(err, db);
  });
};