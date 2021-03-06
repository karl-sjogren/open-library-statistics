/* global module, require, console */
/* jshint indent:2 */
var Q = require('q');

module.exports = function(arr, body) {
  var done = Q.defer();
  var index = 0;
  var success = [],
      failures = [];
  
  function loop() {
    if (index >= arr.length) return done.resolve({ success: success, failures: failures });
    
    var item = arr[index];
    var idx = index++;
    
    body(idx, item).then(function() { 
      success.push(item);
      loop();
    }, function() { 
      failures.push(item);
      loop();
    });
  }

  // Start running the loop in the next tick so that this function is
  // completely async. It would be unexpected if `body` was called
  // synchronously the first time.
  Q.nextTick(loop);

  return done.promise;
};