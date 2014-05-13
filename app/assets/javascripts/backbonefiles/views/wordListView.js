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

    var graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 1080,
        height: 480,
        series: [ {
          data: [ { x: 0, y: 0 }, { x: 10, y: 10 } ],
          color: 'steelblue'
        }]
    });


  var x_axis = new Rickshaw.Graph.Axis.Time({
      graph: graph,
  });

  var y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById('y_axis'),
  });



var slider = $(function() {
$( "#slider" ).slider({
range: true,
min: 0,
max: 500,
values: [ 75, 300 ],
slide: function( event, ui ) {
$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
}
});
$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
" - $" + $( "#slider" ).slider( "values", 1 ) );
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


    // logic to create data array
    var dataArray = [];
    var graphIntervalSeconds = (new Date()) - this.startDate; // total seconds length of line
    var leftSliderVal =  parseFloat($('#left-slider').css('left')) / graph.width; //left slider %
    var rightSliderVal =  parseFloat($('#right-slider').css('left')) / graph.width; //right slider %
    var leftDateTimeInSecs = leftSliderVal * graphIntervalSeconds + this.startDate;
    var rightDateTimeInSecs = rightSliderVal * graphIntervalSeconds + this.startDate;
    var graphObject = this.collection.graphObjectInDateTimeRange(new Date(leftDateTimeInSecs), new Date(rightDateTimeInSecs), 30);
    console.log(graphObject);

    // data: [ { x: 0, y: 0 }, { x: 10, y: 10 } ],

    //call functions from collection
    // reset start date

    //Reset graph data before rendering
    graph.render();
  },
  setStartDate: function(){
    var selectedDate = $('.datepicker').val();
    var startDate = new Date(selectedDate);
    return startDate;
  }
});
