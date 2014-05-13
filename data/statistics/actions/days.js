/* global module, require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var Q = require('q'),
    strftime = require('strftime');

module.exports = function(db, options) {
  var deferred = Q.defer();

  var type = options.type;
  var date = options.date;
  
  var update = {$inc: {}};
  update.$inc['count.day_' + strftime('%d', date) + '.' + type] = 1;
  update.$inc['count.day_' + strftime('%d', date) + '.total'] = 1;

  var collection = db.collection('actions');
  collection.update({month: strftime('%Y-%m', date)}, update, { upsert: true, safe: true }, function(err, docs) {
    if(err) {
      console.log('Failed updating docs for hours');
      deferred.reject(err);
      return;
    }

    deferred.resolve(docs);
  });

  return deferred.promise;
};