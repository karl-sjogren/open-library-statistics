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
    save = require('./save_statistics');

app.use(bodyParserMiddleware());
app.use(lessMiddleware(__dirname + '/public', {force: true, debug: true}));
app.use(express.static(__dirname + '/public'));

server.listen(Number(process.env.PORT || 4096));

app.post('/recieve', function (req, res) {
  var body = req.body;
  if(!body) {
    return;
  }
  
  var opts = {
    type: 'search',
    keyword: body.keywords
  };
  
  save(opts);

  var obj = {
    'keywords': body.keywords,
    'lat': body.lat,
    'lon': body.lon
  };

  io.sockets.emit('search', obj);
  res.end();
});


if(process.env.NODE_ENV === 'development') {
  var shuffle = function(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffleâ€¦
    while (m) {

      // Pick a remaining elementâ€¦
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  };
  
  var randomTitles = ['Ondskan', 'BrÃ¶derna lejonhjÃ¤rta', 'En sak Ã¥ en annan', 'Min bok om mig', 'Isprinsessan', 'En tandlÃ¤kares mardrÃ¶m', 'Hur man skriver en listetta', 'BlÃ¤ckfiskresan'];
  var randomCoordinates = [
    [63.829768, 20.263596], // UmeÃ¥
    [63.093516, 21.676025], // Vasa
    [57.718819, 12.944641], // BorÃ¥s
    [63.173574, 14.660568]  // Ã–stersund
  ];

  setInterval(function() {
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

  
}