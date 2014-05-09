/* global require, __dirname, process, setInterval, console */
/* jshint indent:2 */

var fs = require('fs');
if(fs.existsSync('.env')) {
  require('./.env')(); // Setup custom environment
}

require('newrelic');
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    lessMiddleware = require('less-middleware'),
    bodyParserMiddleware = require('body-parser'),
    basicAuth = require('./middleware/basicauth'),
    error = require('./middleware/error'),
    Q = require('q');

// Precompile bootstrap sources and wait with loading the rest
var compile = require('./bootstrap/compile');

Q.all([compile.less(), compile.js(), compile.fonts()]).then(function() {
  console.log('All precompilation done');

  // Setup middleware functions, the order is important here!
  app.use(bodyParserMiddleware());
  app.use('/', basicAuth('Open Library Statistics Alpha'));

  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  
  app.use('/', lessMiddleware(__dirname + '/public', { force: true, debug: true }));
  app.use('/', express.static(__dirname + '/public'));
  app.use('/bootstrap', express.static(__dirname + '/bootstrap/compiled'));
  app.use('/', error); // Error handlers go last

  // Require the awesome file that require all other routes
  require('./helpers/register-routes')(app, io);  
  require('./helpers/register-partials')();  
  
  if(process.env.NODE_ENV === 'development') {
    require('./helpers/tempdata.js')(app, io); // Load the tempdata-provider
    io.set('log level', 1);
  } else {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    io.set('log level', 1); 
  }
  
  var port = Number(process.env.PORT || 4096);
  console.log('Start listening on port ' + port); 
  // Start listening on the port specified by Heroku or on 4096 if we are developing
  server.listen(port);
});