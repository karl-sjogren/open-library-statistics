/* global require, console, __dirname, setInterval */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    lessMiddleware = require('less-middleware'),
    bodyParserMiddleware = require('body-parser');

app.use(bodyParserMiddleware());
app.use(lessMiddleware(__dirname + '/public', {force: true, debug: true}));
app.use(express.static(__dirname + '/public'));

server.listen(4096);

app.post('/recieve', function (req, res) {
  var body = req.body;
  if(!body)
    return;
  
  var obj = {
    'keywords': body.keywords,
    'lat': body.lat,
    'lon': body.lon
  };
  
  io.sockets.emit('search', obj);
  res.end();
});

var interval = setInterval(function() {
  io.sockets.emit('search', { "keywords": "ondskan", "lat": "63.829768", "lon": "20.263596" });
}, 1500);

io.sockets.on('connection', function (socket) {
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
});

/*

{
  "keywords": "ondskan",
  "lat": null,
  "lon": null
}

{
  "keywords": "ondskan",
  "lat": "64.263684",
  "lon": "20.302734"
}

*/