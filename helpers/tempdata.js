/* global module, require, process, setInterval */
/*jshint indent:2 */

module.exports = function(app, io) {
  var shuffle = function(array) {
    var m = array.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  };

  var randomTitles = ['Ondskan', 'Bröderna lejonhjärta', 'En sak å en annan', 'Min bok om mig', 'Isprinsessan', 'En tandläkares mardröm', 'Hur man skriver en listetta', 'Bläckfiskresan'];
  var randomCoordinates = [
    [63.829768, 20.263596], // Umeå
    [63.093516, 21.676025], // Vasa
    [57.718819, 12.944641], // Borås
    [63.173574, 14.660568]  // Östersund
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


  setInterval(function() {
    var perf = {
      availableMemory: 1751,
      clientKey: '0547fa3bd80c485c439bf42d',
      cpuUsage: 100*Math.random(),
      memoryUsage: 100*Math.random(),
      totalMemory: 8191
    };
    io.sockets.emit('performance', perf);
  }, 500);


  setInterval(function() {
    var miner = {
      clientKey: '0547fa3bd80c485c439bf42d',
      minerName: "DataMinerWorkerThingy",
      catalogName: "OLS Thingy",
      catalogId: "55750197-4a3f-4120-a0eb-686ddc485b20",
      scannedWorksPerMinute: 30 + 300*Math.random(),
      lastScannedId: 30000*Math.random()
    };
    io.sockets.emit('dataminerstats', miner);
  }, 500);
};