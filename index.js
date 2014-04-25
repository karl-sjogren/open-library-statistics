/* global require, __dirname, process */
/*jshint indent:2 */
//require('newrelic');
var express = require('express'),
    app = express(),
    //server = require('http').createServer(app),
    //io = require('socket.io').listen(server),
    lessMiddleware = require('less-middleware'),
    bodyParserMiddleware = require('body-parser');

app.use(bodyParserMiddleware());
app.use(lessMiddleware(__dirname + '/public', {force: true, debug: true}));
app.use(express.static(__dirname + '/public'));

app.listen(Number(process.env.PORT || 4096));

app.post('/recieve', function (req, res) {
  var body = req.body;
  if(!body) {
    return;
  }

  var obj = {
    'keywords': body.keywords,
    'lat': body.lat,
    'lon': body.lon
  };

  //io.sockets.emit('search', obj);
  res.end();
});


//io.sockets.on('connection', function (socket) { });

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

/*
var randomTitles = ['Ondskan', 'Bröderna lejonhjärta', 'En sak å en annan', 'Min bok om mig', 'Isprinsessan', 'En tandläkares mardröm', 'Hur man skriver en listetta', 'Bläckfiskresan'];
var randomCoordinates = [
  [63.829768, 20.263596], // Umeå
  [63.093516, 21.676025], // Vasa
  [57.718819, 12.944641], // Borås
  [63.173574, 14.660568]  // Östersund
];

var interval = setInterval(function() {
  randomCoordinates = shuffle(randomCoordinates);
  randomTitles = shuffle(randomTitles);
  var coords = randomCoordinates[0];
  var obj = {
    'keywords': randomTitles[0],
    'lat': coords[0],
    'lon': coords[1]
  };
  io.sockets.emit('search', obj);
}, 300);

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}*/