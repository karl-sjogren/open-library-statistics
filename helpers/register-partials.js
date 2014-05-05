/* global module, require, __dirname, console */
/*jshint indent:2 */

var fs = require('fs'),
    hbs = require('hbs');

module.exports = function() {
  var partialsDir = __dirname + '/../views/partials';
  console.log('Loading partials from ' + partialsDir);
  
  var filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    console.log('Loading partial: ' + filename);
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
    hbs.registerPartial(name, template);
  });
};