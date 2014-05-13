var WordListView = Backbone.View.extend({
  el: '#word-chart',
  events: {
    'change #datepicker': 'render',
    'mousedown .ui-slider-handle': 'renderAlchemyOnUp'
  },
  initialize: function(){
    this.startDate = new Date().getTime() - 24*60*60*1000;
    this.listenTo(this.collection, 'add', this.render);
    this.listenTo(this.collection, 'reset', this.render);
    this.render();
  },
  render: function(){
    this.collection.fetch();
    this.chart();
  },
  renderAlchemyOnUp: function(){},
  chart: function(){

    //Set start date if there is one
    this.startDate = isNaN(this.setStartDate()) ? this.startDate : this.setStartDate();

    //Main GRAPH details
    $('#chart').remove();
    $('#y_axis').remove();
    $('#chart_container').prepend("<div id='chart'>");
    $('#chart_container').prepend("<div id='y_axis'>");
    $('.datepicker').datepicker();

    var dataArray = [];
    var graphIntervalSeconds = new Date() - this.startDate; // total seconds length of line
    var leftSliderVal =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderVal =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTimeInSecs = leftSliderVal * graphIntervalSeconds + this.startDate;
    var rightDateTimeInSecs = rightSliderVal * graphIntervalSeconds + this.startDate;
    var graphDataArray = this.collection.graphObjectInDateTimeRange(new Date(leftDateTimeInSecs), new Date(rightDateTimeInSecs), 30);

     var graph = new Rickshaw.Graph({
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

    var slider = new Rickshaw.Graph.RangeSlider( {
      graph: graph,
      element: document.querySelector('#slider-range')

    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph,
      formatter: function(series, x, y) {
        var date = '<span class="time">' + new Date(x * 1000).toString() + '</span>';
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
    var startDate = new Date(selectedDate).getTime();
    return startDate;
  }
});
