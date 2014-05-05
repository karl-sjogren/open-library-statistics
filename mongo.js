/* global require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var fs = require('fs');
if(fs.existsSync('.env')) {
  var env = require('./.env')(); // Setup custom environment
}

var opts = {
  type: 'search',
  keyword: 'Ondskan'
};

/*
var ObjectID = require('mongodb').ObjectID;

for(var i = 0; i < 100; i++) {
  console.log(new ObjectID(Math.random() * 1000000000).toHexString() + '\r\n');
}*/

//var statistics = require('./statistics');
//statistics.save(opts);


var clientInstances = require('./data/client-instances');
clientInstances.list().then(function(docs) {
  console.log(docs);
});
