/*global module, require, process */
var MongoClient = require('mongodb').MongoClient;

module.exports = function(callback) {
  MongoClient.connect(process.env.MONGOLAB_URI, callback);
};