/* global module, require, console, Buffer */
var less = require('less'),
    UglifyJS = require('uglify-js'),
    fs = require('fs');

module.exports.less = function() {
  if(!fs.existsSync('./bootstrap/compiled/')) {
    fs.mkdirSync('./bootstrap/compiled/');
  }
  if(!fs.existsSync('./bootstrap/compiled/styles/')) {
    fs.mkdirSync('./bootstrap/compiled/styles/');
  }

  var srcCode = fs.readFileSync('./bootstrap/less/bootstrap.less', 'utf8');

  var parser = new(less.Parser)({
    paths: ['.', './bootstrap/less/'], // Specify search paths for @import directives
    filename: 'style.less' // Specify a filename, for better error messages
  });

  parser.parse(srcCode, function(parse_err, tree) {
    if (parse_err) {
      console.log(parse_err);
    }

    //var minifyOptions = _.pick(options, lessOptions.render);

    try {
      var css = tree.toCSS({ compress: true });
      fs.writeFileSync('./bootstrap/compiled/styles/bootstrap.css', css, 'utf8');
    } catch (e) {
      console.log(e);
    }
  });
};

module.exports.js = function() {
  if(!fs.existsSync('./bootstrap/compiled/')) {
    fs.mkdirSync('./bootstrap/compiled/');
  }
  if(!fs.existsSync('./bootstrap/compiled/js/')) {
    fs.mkdirSync('./bootstrap/compiled/js/');
  }
  var files = [];
  var path = './bootstrap/js/';
  fs.readdirSync(path).forEach(function(file) {
    if(file[0] === '.' || file === 'tests')
      return;
    files.push(path + file);
  });

  try {
    var result = UglifyJS.minify(files);
    //fs.writeSync('./bootstrap/compiled/js/bootstrap.js', new Buffer(result.code));
    fs.writeFileSync('./bootstrap/compiled/js/bootstrap.js', result.code, 'utf8');
  } catch (e) {
    console.log(e);
  }
};