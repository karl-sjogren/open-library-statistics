/* global require, process, setInterval */
/*jshint indent:2 */

module.exports = function(app, io) {
  if(process.env.NODE_ENV === 'development') {
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
  }
}