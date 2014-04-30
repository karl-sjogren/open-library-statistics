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

io.set('log level', 1);

app.use(bodyParserMiddleware());
app.use('/', basicAuth(function (user, password) {
    return user === process.env.AUTH_USER && password == process.env.AUTH_PASSWORD;
  }, "Open Library Statistics"));

app.use('/', lessMiddleware(__dirname + '/public', {force: true, debug: true}));
app.use('/', express.static(__dirname + '/public'));

server.listen(Number(process.env.PORT || 4096));

require('./routes/index.js')(app, io);