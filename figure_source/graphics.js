/*  Adapted from http://www.flotcharts.org/flot/examples/tracking/index.html,
**  Original Code is Copyright © 2007 - 2014 IOLA and Ole Laursen 
*/
$(document).ready(function(){
  $("#content").height($(window).height());
  $("#content").resize(function(){
    $("#content").height($(window).height());
  });
});

$(function() {
  var updateCalculation;
  if($("#content").hasClass("full-calculation")){
    updateCalculation = updateFullCalculation;
  }
  else{
    updateCalculation = updateSimpleCalculation;
  }

  fullPlotOptions = {
    series: {
      lines: {
        show: true
      }
    },
    crosshair: {
      mode: "x"
    },
    grid: {
      hoverable: true,
      autoHighlight: false
    },
    yaxis: {
      min: -0.1,
      max: 1.5,
      axisLabel: "probability of setting streak"
    },
    xaxis: {
      axisLabel: 'Streak Length'
    }
  };

  simplePlotOptions = {
    series: {
      lines: {
        show: true
      }
    },
    crosshair: {
      mode: "x"
    },
    grid: {
      hoverable: true,
      autoHighlight: false
    },
    yaxis: {
      min: -0.1,
      max: 1.2,
      axisLabel: "probability of setting streak"
    },
    xaxis: {
      axisLabel: '3-point shooting percentage'
    }
  };
  updateCalculation();

  var legends = $("#placeholder .legendLabel");

  legends.each(function () {
    // fix the widths so they don't jump around
    $(this).css('width', $(this).width());
  });

  var updateLegendTimeout = null;
  var updateCalculationTimeout = null;
  var latestPosition = null;

  function updateLegend() {
    legends = $("#placeholder .legendLabel");
    updateLegendTimeout = null;

    var pos = latestPosition;

    var axes = plot.getAxes();
    if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
      pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
      return;
    }

    var i, j, dataset = plot.getData();
    for (i = 0; i < dataset.length; ++i) {

      var series = dataset[i];

      // Find the nearest points, x-wise

      for (j = 0; j < series.data.length; ++j) {
        if (series.data[j][0] > pos.x) {
          break;
        }
      }

      // Now Interpolate

      var y,
        p1 = series.data[j - 1],
        p2 = series.data[j];

      if (p1 == null) {
        y = p2[1];
      } else if (p2 == null) {
        y = p1[1];
      } else {
        y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
      }

      legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
    }
  }

  function updateFullCalculation(e){
    updateCalculationTimeout = null;
    var wrongWay = [];
    var rightWay = [];
    var streakLength = parseInt($("#range-streak-length").val());
    var numDays = parseInt($("#range-num-days").val());
    var shotsPerDay = parseInt($("#range-shots-per-day").val());
    var shootingPercentage = Number($("#range-shooting-percentage").val());
    $("#indicator-streak-length").text(streakLength);
    $("#indicator-num-days").text(numDays);
    $("#indicator-shots-per-day").text(shotsPerDay);
    $("#indicator-shooting-percentage").text(shootingPercentage);
    
    for (var n = 30; n < 100; n += 1) {
      rightWay.push([n, rightProbability(shootingPercentage, shotsPerDay, n, numDays)]);
      wrongWay.push([n, simpleProbability(shootingPercentage, n, numDays)]);
    }
    updateFullPlot(wrongWay, rightWay);
  }

  function updateSimpleCalculation(e){
    updateCalculationTimeout = null;
    var x = [];
    var streakLength = parseInt($("#range-streak-length").val());
    var numDays = parseInt($("#range-num-days").val());
    $("#indicator-streak-length").text(streakLength);
    $("#indicator-num-days").text(numDays);
    for (var i = 0.2; i < 1; i += 0.005) {
      x.push([i, simpleProbability(i, streakLength, numDays)]);
    }
    updateSimplePlot(x);
  }

  function updateSimplePlot(wrongWay){
    plot = $.plot("#placeholder", [{data: wrongWay, label: "Prob = 0.00"}], simplePlotOptions);
  }

  function updateFullPlot(wrongWay, rightWay){
    plot = $.plot("#placeholder", [{data: rightWay, label: "Full="}, {data: wrongWay, label: "Simple="}], fullPlotOptions);
  }

  $("#placeholder").bind("plothover",  function (event, pos, item) {
    latestPosition = pos;
    if (!updateLegendTimeout) {
      updateLegendTimeout = setTimeout(updateLegend, 50);
    }
  });

  $(document).on( "input change", "input[type='range']", function(){
    if (!updateCalculationTimeout) {
      updateCalculationTimeout = setTimeout(updateCalculation, 50);
    }
  });
});
