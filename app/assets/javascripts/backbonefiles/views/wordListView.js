var graph

var WordListView = Backbone.View.extend({
  el: '#word-chart',
  // className: 'word-graph',
  events: {
    'change #datepicker': 'setStartDate'
  },
  initialize: function(){
    this.startDate = new Date().getTime() - 24*60*60*1000;
    this.listenTo(this.collection, 'add', this.render);
    //not sure if next line is necessary
    this.listenTo(this.collection, 'reset', this.render);
    this.render();
    //set up listeners to update graph whenever collection has additions

  },
  render: function(){
    this.collection.fetch();
    this.chart();
    // do javascript setup for graph here
  },
  // addOne will eventually be "update graph" or "appendToGraph"
  addOne: function(wordModel){
  },
  chart: function(){

//Main GRAPH details
    // Remove duplicates
    $('#chart').remove();
    $('#y_axis').remove();
    $('#chart_container').prepend("<div id='chart'>");
    $('#chart_container').prepend("<div id='y_axis'>");
    $('.datepicker').datepicker();

    var dataArray = [];
    var graphIntervalSeconds = (new Date()) - this.startDate; // total seconds length of line
    var leftSliderVal =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderVal =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTimeInSecs = leftSliderVal * graphIntervalSeconds + this.startDate;
    var rightDateTimeInSecs = rightSliderVal * graphIntervalSeconds + this.startDate;
    var graphDataArray = this.collection.graphObjectInDateTimeRange(new Date(leftDateTimeInSecs), new Date(rightDateTimeInSecs), 30);
    console.log(graphDataArray[0]['x']);

     graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 1080,
        height: 480,
        series: [{
          data: graphDataArray,
          color: 'steelblue'
        }]
    });


  var x_axis = new Rickshaw.Graph.Axis.Time({
      graph: graph,
      timeUnit: 'seconds'
  });

  var y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById('y_axis'),
  });


//SLIDER details

    var slider = new Rickshaw.Graph.RangeSlider( {
        graph: graph,
        element: document.querySelector('#slider-range')
    });


//HOVER details

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph,
      formatter: function(series, x, y) {
        var date = '<span class="time">' + new Date(x * 1000).toUTCString() + '</span>';
        var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';

        //Need to change the parseInt(y) to be the array of words and the Date function work properly
        var content = swatch + date  + '<br>' + parseInt(y);

        // I THINK it would be nicer if on hover over the words of the array were displayed horizontally like on the legend here: http://code.shutterstock.com/rickshaw/examples/hover.html //
        return content;
      }
    });

    graph.render();
  },
  setStartDate: function(){
    var selectedDate = $('.datepicker').val();
    var startDate = new Date(selectedDate);
    return startDate;
  }
});
