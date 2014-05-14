var graph;
var stringToQuery;

var WordListView = Backbone.View.extend({
  el: '#word-chart',
  events: {
    'change #datepicker': 'render',
    'mouseover .ui-slider-handle': 'setUpAlchemy',
    'click .treemap-node': 'googleResults'
  },

  initialize: function(){
    this.DEFAULTHOURSPAST = 6;
    this.XINTERVAL = 10;
    this.TICKSECONDS = 10;
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
  setUpAlchemy: function(){
    //get left slider val in seconds
    //get right slider val in seconds
    var graphIntervalSeconds = new Date() - this.startDate; // total seconds length of line
    var leftSliderPct =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderPct =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTime = (leftSliderPct * graphIntervalSeconds + this.startDate)/1000;
    // is this just Date.now?
    var rightDateTime = (rightSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var stringToQuery = this.collection.alchemyQueryString(leftDateTime, rightDateTime);
    this.renderAlchemy(stringToQuery);
  },
  renderAlchemy: function(stringToQuery){
    //assume at this point we have alchemyQueryString
    $.ajax({
      url: '/alchemy_search',
      method: 'get',
      data: {
        words: stringToQuery
      },
      dataType: 'json'
    }).done(function(data){

     var entities = _.map(data.entities, function(entity){
          var value = parseFloat(entity["relevance"]);
        return {"label": entity["text"], "value": (value * 100), "type": entity["type"]};
    });
      this.treemap(entities);
   }.bind(this));
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
        if ( (parseInt(y) >= 0) ) {
          $('.detail').css("visibility", "visible");
          var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
        //Need to change the parseInt(y) to be the array of words and the Date function work properly
        } else {
          $('.detail').css("visibility", "hidden");
          var swatch = '<span class="detail_swatch" style="background-color: rgba(0,0,0,0)"></span>';
        }
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
    var selectedDate = $('.form-control').val();
    var startDate = new Date(selectedDate).getTime();
    return startDate;
  },

  treemap: function(entities){
    // $('#treemap').remove();
                $("#treemap").treemap({data: entities,
                  colors: ['#990000', '#002BD7'],
                  width: 1080,
                });
  },
  displayError: function(){
    $('<div id="RelephantError">RelephantError: Search query too large.</div>').appendTo('#word-chart');
  },
  googleResults: function(entity){
    $.ajax({
      url: '/google_search',
      method: 'get',
      data: {
        entity: entity
      },
      dataType: 'json'
    }).done(function(data){
        var results = data.items;
    });
      this.googleResultsRender(results);
   }.bind(this),

  googleResultsRender: function(result){

    // _.each(results){
    //   var image = result["image"];
    //   var link = result["link"];
    //   var title = result["title"];
    //   var snippet = result["snippet"];
    //   $('<div><img src="' + image + '"><a href="' + link + '"><h3>'+ title +'</h3></a><br><p>'+ snippet + '</p>').appendTo('#google-results');
    // }
  }


});
