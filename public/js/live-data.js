/* global $, document, console, io */
/* jshint indent:2 */
$(document).ready(function() {
  var socket = io.connect();
  socket.on('performance', function (data) {
    var clientKey = data.clientKey;
    if(!clientKey) {
      return;
    }
    
    var row = $('*[data-client-key="' + clientKey + '"]');
    row.find('.cpu-usage').html(Math.floor(data.cpuUsage) + '%');
    
    var cpuData = row.find('.cpu-graph').data('graph');
    cpuData.push(Math.floor(data.cpuUsage));
    row.find('.cpu-graph').data('graph', cpuData)
    
    row.find('.memory-usage').html(Math.floor(data.memoryUsage) + '% (' + (data.totalMemory - data.availableMemory) + '/' + data.totalMemory + ' MB)');
    var memoryData = row.find('.memory-graph').data('graph');
    memoryData.push(Math.floor(data.memoryUsage));
    row.find('.memory-graph').data('graph', memoryData)
  });
});



$(function() {
  $('.cpu-graph, .memory-graph').each(function() {
    var container = $(this);
    var maximum = container.outerWidth() / 2 || 300;
    var initialData = [];
    for(var i = 0; i <= maximum; i++) {
      initialData.push(0);
    }
    container.data('graph', initialData);

    function formatData() {
      var data = container.data('graph');

      while(data.length > maximum) {
        data = data.slice(1);
      }

      var res = [];
      for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]]);
      }

      container.data('graph', data);
      return res;
    }

    var color = container.hasClass('cpu-graph') ? '#0d8fdb' : null;
    var series = [{
      data: formatData(),
      color: color,
      lines: {
        fill: true
      }
    }];


    var plot = $.plot(container, series, {
      grid: {
        show: false,
      },
      xaxis: {
        show: false,
      },
      yaxis: {
        show: false,
        min: 0,
        max: 100
      },
      legend: {
       show: false
      }
    });

    setInterval(function updateRandom() {
      series[0].data = formatData();
      plot.setData(series);
      plot.draw();
    }, 400);
  });
});