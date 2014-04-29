/* global require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var fs = require('fs');
if(fs.existsSync('.env')) {
  var env = require('./.env')(); // Setup custom environment
}

var MongoClient = require('mongodb').MongoClient,
  Q = require('q');

MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
  if(err)
    throw err;

  var type = 'search';
  var date = new Date();
  var keyword = 'Ondskan';
  
  var options = {
    date: new Date(),
    type: 'search',
    keyword: 'Ondskan'
  };
  
  var actions = db.collection('actions');

  var updateHours = require('./updates/hours');
  var updateDays = require('./updates/days');
  var updateKeywords = require('./updates/keywords');

  Q.all([updateHours(db, options), updateDays(db, options), updateKeywords(db, options)]).then(function() {
    console.log('All updates done, closing database');
    db.close();
  });  
});