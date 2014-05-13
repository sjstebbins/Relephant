var WordListView = Backbone.View.extend({
  el: '#word-chart',
  initialize: function(){
    this.listenTo(this.collection, 'add', this.render);
    this.render();
    //set up listeners to update graph whenever collection has additions

    //not sure if next line is necessary
    this.listenTo(this.collection, 'reset', this.render);
  },
  render: function(){
    this.collection.fetch();
    // do javascript setup for graph here
    this.chart();
  },
  // addOne will eventually be "update graph" or "appendToGraph"
  addOne: function(wordModel){
  },

  chart: function(){

//Main GRAPH details

    var graph = new Rickshaw.Graph( {
        element: document.querySelector("#chart"),
        width: 1080,
        height: 480,
        series: [ {

          //EXAMPLE data
                data: [ { x: -1893456000, y: 92228531 }, { x: -1577923200, y: 106021568 }, { x: -1262304000, y: 123202660 }, { x: -946771200, y: 132165129 }, { x: -631152000, y: 151325798 }, { x: -315619200, y: 179323175 }, { x: 0, y: 203211926 }, { x: 315532800, y: 226545805 }, { x: 631152000, y: 248709873 }, { x: 946684800, y: 281421906 }, { x: 1262304000, y: 308745538 } ],
                color: 'steelblue'
        } ]
} );



var x_axis = new Rickshaw.Graph.Axis.Time( {
  graph: graph,
} );

var y_axis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById('y_axis'),
} );
graph.render();

//SLIDER details

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


// var slider = new Rickshaw.Graph.RangeSlider( {
//     graph: graph,
//     element: document.querySelector('#slider-range')
// });

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


  },

});
