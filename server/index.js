/*global module, require, process */

var fs = require('fs'),
    path = require('path');

if(fs.existsSync(path.resolve('.env'))) {
  console.log('Loading development environment');
  require(path.resolve('.env'))(); // Setup custom environment
}

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser'),
    basicAuth = require('./middleware/basicauth'),
    Q = require('q'),
    logentries = require('node-logentries');

// Good for debugging when we leave heroku
process.on('uncaughtException', function (err) {
    fs.writeFileSync("uncaughtException.txt",  err, "utf8");    
})

var logger = logentries.logger({
  token: '6d50566f-617a-46bb-9bfb-6f6f73fcf1df'
});

console.log = (function() {
  var orig = console.log;
  return function() {
    try {
      logger.log('debug', arguments[0])
    } catch(e) { /* Naah */ }
    orig.apply(console, arguments);
  };
})();

module.exports = function() {
  // Setup middleware functions, the order is important here!
  app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
  app.use(bodyParser.json({limit: '10mb'}))
  
  app.use('/', basicAuth('Open Library Statistics Alpha'));

  app.use('/', express.static(__dirname + './../dist'));

  // Require the awesome file that require all other routes
  require('./helpers/register-routes')(app, io);

  app.use('/', require('./middleware/error')); // Error handlers go last

  if(process.env.NODE_ENV === 'development') {
    //require('./helpers/tempdata.js')(app, io); // Load the tempdata-provider
    io.set('log level', 1);
  } else {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    io.set('log level', 1); 
  }

  // When running under iisnode, process.env.PORT is a namedpipe
  // instead of a regular port number and Number() will therefore
  // produce NaN.
  var port = process.env.PORT || 4096;
  console.log('Start listening on port ' + port); 
  // Start listening on the port specified by Heroku or on 4096 if we are developing
  server.listen(port);
};