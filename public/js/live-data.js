/* global $, document, console, io */
/* jshint indent:2 */
$(document).ready(function() {
  var socket = io.connect();
  socket.on('performance', function (data) {
    var clientKey = data.clientKey;
    if(!clientKey) {
      return;
    }
    
    var row = $('tr[data-client-key="' + clientKey + '"]');
    if(!!row) {
      row.find('.cpu-usage').html(Math.floor(data.cpuUsage) + '%');
      row.find('.memory-usage').html(Math.floor(data.memoryUsage) + '% (' + (data.totalMemory - data.availableMemory) + '/' + data.totalMemory + ' MB)');
    }
    
    var cpuGraph = $('.cpu-graph[data-client-key="' + clientKey + '"]');
    var cpuData = cpuGraph.data('graph');
    cpuData.push(Math.floor(data.cpuUsage));
    cpuGraph.data('graph', cpuData);

    var memoryGraph = $('.memory-graph[data-client-key="' + clientKey + '"]');
    var memoryData = memoryGraph.data('graph');
    memoryData.push(Math.floor(data.memoryUsage));
    memoryGraph.data('graph', memoryData);
  });
  
  socket.on('dataminerstats', function (data) {
    var clientKey = data.clientKey;
    if(!clientKey) {
      return;
    }
    
    var knob = $('.knob[data-client-key="' + clientKey + '"][data-catalog-id="' + data.catalogId + '"][data-miner-name="' + data.minerName + '"]');
    knob.val(data.scannedWorksPerMinute).trigger('change');
  });
});