var graph;

var WordListView = Backbone.View.extend({
  el: '#word-chart',
  events: {
    'change #datepicker': 'render',
  },

  initialize: function(){
    this.DEFAULTHOURSPAST = 1;
    this.XINTERVAL = 1;
    this.TICKSECONDS = 1;
    this.SMOOTHING = 1.02;
    this.tempWordStorage = [];
    // set start date using function instead of using following line
    this.startDate = new Date().getTime() - this.DEFAULTHOURSPAST*60*60*1000; // in milliseconds
    this.endDate = new Date().getTime();
    this.collection.fetch();
    this.listenTo(this.collection, 'add', this.addToTempStorage);
    // this.listenTo(this.collection, 'reset', this.render);
    this.dataArray = this.queryDBforGraphData(this.XINTERVAL);
    this.initializeChart(this.dataArray);
    this.render();
  },

  render: function(){
    graph.render();
    this.setSlider();
    this.setTickInterval();
  },

  setTickInterval: function(){
    var baseTimeInSeconds = this.endDate / 1000;
    var counter = 1;
    var interval = setInterval(function(){
      var curGraphData = graph.series[0].data;
      //smooth out graph on no talking
      var yVal = this.tempWordStorage.length === 0 ? curGraphData[curGraphData.length - 1]['y'] / this.SMOOTHING : this.tempWordStorage.length;
      graph.series[0].data.push({x: baseTimeInSeconds + (this.TICKSECONDS * counter),
                                 y: yVal});
      this.tempWordStorage = [];
      graph.render();
      counter++;
    }.bind(this), this.TICKSECONDS * 1000);
  },

  initializeChart: function(dataArray){
    this.$('#chart_container').prepend("<div id='chart'>");
    this.$('#chart_container').prepend("<div id='y_axis'>");
    this.$('.datepicker').datepicker();

    graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 1080,
        height: 480,
        series: [{
          data: dataArray,
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
  },

  queryDBforGraphData: function(interval){
    var dataArray = [];
    var graphIntervalSeconds = new Date() - this.startDate; // total seconds length of line
    var leftSliderPct =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderPct =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTime = (leftSliderPct * graphIntervalSeconds + this.startDate)/1000;
    // is this just Date.now?
    var rightDateTime = (rightSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var graphDataArray = this.collection.graphObjectInDateTimeRange(leftDateTime, rightDateTime, interval);
    return graphDataArray;
  },
  addToTempStorage: function(newWord){
    this.tempWordStorage.push(newWord.get('letters'));
  },
  setSlider: function(){
    var slider = new Rickshaw.Graph.RangeSlider( {
      graph: graph,
      element: document.querySelector('#slider-range')
    });
  },
  setStartDate: function(){
    var selectedDate = $('.datepicker').val();
    var startDate = new Date(selectedDate).getTime();
    return startDate;
  }
});
