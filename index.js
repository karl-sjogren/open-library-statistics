/* global require, __dirname, process, setInterval */
/*jshint indent:2 */

var fs = require('fs');
if(fs.existsSync('.env')) {
  var env = require('./.env')(); // Setup custom environment
}

require('newrelic');
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    lessMiddleware = require('less-middleware'),
    bodyParserMiddleware = require('body-parser'),
    basicAuth = require('./middleware/basicauth');

// Precompiled bootstrap sources
var compile = require('./bootstrap/compile');
compile.less();
compile.js();

// Set a better loglevel for socket.io so we don't get spammed
io.set('log level', 1);


// Setup middleware functions, the order is important here!
app.use(bodyParserMiddleware());
app.use('/', basicAuth(function (user, password) {
    return user === process.env.AUTH_USER && password == process.env.AUTH_PASSWORD;
  }, "Open Library Statistics"));

app.use('/', lessMiddleware(__dirname + '/public', {force: true, debug: true}));
app.use('/', express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/bootstrap/compiled'));

server.listen(Number(process.env.PORT || 4096));

require('./routes/index.js')(app, io);