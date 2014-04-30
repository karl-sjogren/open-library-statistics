/* global require, module, console */
var Client = require('./index.js'),
  Q = require('q');

module.exports.save = function(options) {
  Client(function(err, db) {
    if(err)
      throw err;

    options = options || { };
    
    var opts = {
      date: new Date(),
      type: options.type || '',
      keyword: options.keyword || ''
    };

    var updateHours = require('./statistics/hours');
    var updateDays = require('./statistics/days');
    var updateKeywords = require('./statistics/keywords');

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
      console.log('All updates done, closing database');
      db.close();
    });  
  });
};