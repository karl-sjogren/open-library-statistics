/* global $, document, console, io */
/* jshint indent:2 */
$(document).ready(function() {
  var socket = io.connect();
  socket.on('performance', function (data) {
    console.log(data);
    var clientKey = data.clientKey;
    if(!clientKey) {
      return;
    }
    
    var row = $('*[data-client-key="' + clientKey + '"]');
    row.find('.cpu-usage').html(Math.floor(data.cpuUsage) + '%');
    row.find('.memory-usage').html(Math.floor(data.memoryUsage) + '% (' + (data.totalMemory - data.availableMemory) + '/' + data.totalMemory + ' MB)');
  });
});