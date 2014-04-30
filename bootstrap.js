/* global require, __dirname, process, setInterval, console */
/*jshint indent:2 */

var fs = require('fs');
if(fs.existsSync('.env')) {
  var env = require('./.env')(); // Setup custom environment
}

var compile = require('./bootstrap/compile');
compile.less();
compile.js();