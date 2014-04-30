/* global module, require, console, Buffer */
var less = require('less'),
    UglifyJS = require('uglify-js'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    Q = require('q');

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

  var deferred = Q.defer();
  parser.parse(srcCode, function(parse_err, tree) {
    if (parse_err) {
      console.log(parse_err);
    }

    var css = tree.toCSS({ compress: true });
    fs.writeFile('./bootstrap/compiled/styles/bootstrap.css', css, 'utf8', function(err) {
      if (err) {
        console.log(err);
      }
      deferred.resolve();      
    });

  });
  return deferred.promise;
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

  var deferred = Q.defer();
  var result = UglifyJS.minify(files);
  fs.writeFile('./bootstrap/compiled/js/bootstrap.js', result.code, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
    deferred.resolve();      
  });

  return deferred.promise;
};

module.exports.fonts = function() {
  if(!fs.existsSync('./bootstrap/compiled/')) {
    fs.mkdirSync('./bootstrap/compiled/');
  }

  var deferred = Q.defer();

  ncp.limit = 16;
  ncp('./bootstrap/fonts/', './bootstrap/compiled/fonts/', function (err) {
    if (err) {
      console.log(err);
    }
    deferred.resolve();
  });
  return deferred.promise;
};