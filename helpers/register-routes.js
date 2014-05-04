/*global module, require, __dirname, console */
var fs = require('fs');

module.exports = function(app, io) {
  var partialsDir = __dirname + '/../routes';
  console.log('Loading routes from ' + partialsDir);
  
  var filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    if (filename === 'index.js')
      return;
    
    console.log('Loading route: ' + filename);
    var name = filename.substr(0, filename.indexOf('.'));
    require(partialsDir + '/' + name)(app, io);
  });
};