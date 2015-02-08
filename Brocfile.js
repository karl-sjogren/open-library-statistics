/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees  = require('broccoli-merge-trees');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different 
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

var rootPath = 'bower_components/bootstrap/dist/';

app.import(rootPath + 'css/bootstrap-theme.css');
app.import(rootPath + 'css/bootstrap.css');

app.import(rootPath + 'js/bootstrap.js');

var glyphicons = pickFiles(rootPath + 'fonts', {
  srcDir: '/',
  files: [
    'glyphicons-halflings-regular.ttf',
    'glyphicons-halflings-regular.woff',
    'glyphicons-halflings-regular.eot',
    'glyphicons-halflings-regular.svg'
  ],
  destDir: '/fonts'
});

app.import('bower_components/fontawesome/css/font-awesome.css');
var fontawesome = pickFiles('bower_components/fontawesome/fonts', {
  srcDir: '/',
  files: [
    'fontawesome-webfont.ttf',
    'fontawesome-webfont.woff',
    'fontawesome-webfont.eot',
    'fontawesome-webfont.svg',
    'FontAwesome.otf'
  ],
  destDir: '/fonts' 
});

app.import('bower_components/moment/moment.js');
app.import('bower_components/signalr/jquery.signalR.js');
app.import('bower_components/spinjs/spin.js');

app.import('bower_components/toastr/toastr.js');
app.import('bower_components/toastr/toastr.css');

app.import('vendor/leaflet-master/leaflet-src.js');
app.import('vendor/leaflet-master/leaflet.css');

var leaflet = pickFiles('vendor/leaflet-master/images', {
  srcDir: '/',
  files: [
    '*'
  ],
  destDir: '/assets/leaflet-images'
});

/* SB Admin includes */
app.import('vendor/sb-admin/plugins/metisMenu/metisMenu.js');
app.import('vendor/sb-admin/sb-admin-2.js');

app.import('vendor/sb-admin/plugins/metisMenu/metisMenu.css');
app.import('vendor/sb-admin/plugins/timeline.css');
app.import('vendor/sb-admin/sb-admin-2.css');

module.exports = mergeTrees([
  app.toTree(),
  glyphicons,
  fontawesome,
  leaflet
]);