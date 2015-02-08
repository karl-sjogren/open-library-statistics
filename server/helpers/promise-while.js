/* global module, require */

var Q = require('q');

module.exports = function (condition, body) {
    var done = Q.defer();

    function loop() {
        if (!condition()) return done.resolve();
        // Use `when`, in case `body` does not return a promise.
        // When it completes loop again otherwise, if it fails, reject the
        // done promise
        Q.when(body(), loop, done.reject);
    }

    // Start running the loop in the next tick so that this function is
    // completely async. It would be unexpected if `body` was called
    // synchronously the first time.
    Q.nextTick(loop);

    return done.promise;
};