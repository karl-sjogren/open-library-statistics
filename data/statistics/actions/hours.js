/* global module, require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var Q = require('q'),
    strftime = require('strftime');

module.exports = function(db, options) {
  var deferred = Q.defer();

  var type = options.type;
  var date = options.date;

  var update = {$inc: {}};
  update.$inc['count.hour_' + strftime('%H', date) + '.' + type] = 1;
  update.$inc['count.hour_' + strftime('%H', date) + '.total'] = 1;

  var collection = db.collection('actions');
  collection.update({ date: strftime('%Y-%m-%d', date), clientKey: options.clientKey }, update, { upsert: true, safe: true }, function(err, docs) {
    if(err) {
      console.log('Failed updating docs for days');
      deferred.reject(err);
      return;
    }

    deferred.resolve(docs);
  });

  return deferred.promise;
};