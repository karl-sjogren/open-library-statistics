/* global require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var fs = require('fs'),
    Q = require('q');
if(fs.existsSync('.env')) {
  var env = require('./.env')(); // Setup custom environment
}

var compile = require('./bootstrap/compile');

Q.all([compile.less(), compile.js(), compile.fonts()]).then(function() {
  console.log('All compilation done');
});