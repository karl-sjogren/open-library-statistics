/* global module, require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var Q = require('q'),
    strftime = require('strftime');

module.exports = function(db, options) {
  var deferred = Q.defer();

  var keyword = options.keyword.toLowerCase();
  var date = options.date;
  
  var update = {$inc: {}};
  update.$inc['count.date_' + strftime('%Y-%m-%d', date)] = 1;
  update.$inc['count.total'] = 1;

  var collection = db.collection('keywords');
  collection.update({keyword: keyword}, update, { upsert: true, safe: true }, function(err, docs) {
    if(err) {
      console.log('Failed updating docs for keyword ' + keyword);
      deferred.reject(err);
      return;
    }

    deferred.resolve(docs);
  });

  return deferred.promise;
};