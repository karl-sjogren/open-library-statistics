var MongoClient = require('mongodb').MongoClient,
  Q = require('q');

module.exports = function(options) {
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err)
      throw err;

    options = options || { };
    
    var opts = {
      date: new Date(),
      type: options.type || '',
      keyword: options.keyword || ''
    };

    var actions = db.collection('actions');

    var updateHours = require('./updates/hours');
    var updateDays = require('./updates/days');
    var updateKeywords = require('./updates/keywords');

    Q.all([updateHours(db, opts), updateDays(db, opts), updateKeywords(db, opts)]).then(function() {
      console.log('All updates done, closing database');
      db.close();
    });  
  });
};