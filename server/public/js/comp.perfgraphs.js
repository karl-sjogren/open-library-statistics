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

    var showMarkings = container.hasClass('large-graph');

    var plot = $.plot(container, series, {
      grid: {
        show: showMarkings,
        borderWidth: 0
      },
      xaxis: {
        show: false,
      },
      yaxis: {
        show: showMarkings,
        min: 0,
        max: 100
      },
      legend: {
       show: false
      }
    });

    function draw() {
      series[0].data = formatData();
      plot.setData(series);
      plot.draw();
    }
    
    setInterval(draw, 400);
    
    $(window).resize(function() {
      if (container.width() == 0 || container.height() == 0)
          return;

      plot.resize();
      plot.setupGrid();
      plot.draw();
    });
  });
});