var graph;
var stringToQuery;

var WordListView = Backbone.View.extend({
  el: '#word-chart',
  events: {
    'click button#word-search': 'wordSearch',
    'click button#datetimebutton': 'resetTime',
    'click button#alchemy': 'setUpAlchemy',
    'click button#transcript': 'generateTranscript'
  },

  initialize: function(){
    self = this;
    this.$('#chart_container').remove();
    $("<div id=chart_container></div>").insertBefore('#slider-range');
    this.collection.fetch();
    this.listenTo(this.collection, 'add', this.addToTempStorage);

    this.DEFAULTHOURSPAST = 1;
    this.XINTERVALSECONDS = 30;
    this.TICKSECONDS = 30;
    this.SMOOTHING = 1.01;
    this.tempWordStorage = [];

    this.startDate = this.setStartDate();
    this.endDate = new Date().getTime(); //current time
    this.graphObjectArray = this.queryDBforGraphData(this.XINTERVALSECONDS);
    this.render();
  },

  render: function(){
    this.lineDataArray = this.getLineDataArray(this.graphObjectArray);
    this.scatterDataArray = [{x: this.startDate/1000, y: 0}];
    this.initializeChart();
    graph.render();
    this.setSlider();
    this.setTickInterval();
  },

  generateTranscript: function(){
    var graphIntervalSeconds = new Date() - this.startDate; // total seconds length of line
    var leftSliderPct =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderPct =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTime = (leftSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var rightDateTime = (rightSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var transcript = this.collection.alchemyQueryString(leftDateTime, rightDateTime).split("+").join(" ");
    $('#transcript-box').empty();
    $('#transcript-box').slideDown();
    $('#transcript-box').append("<h4 id=transcript-title>Trancript from " + new Date(leftDateTime*1000).toString() + " to " + new Date(rightDateTime*1000).toString() + ":</h4>");
    $('#transcript-box').append("<p id=transcript-content>" + transcript + "</p>");

  },

  resetTime: function(){
    this.startDate = this.setStartDate();
    clearInterval(this.currentInterval);
    this.initialize();
  },

  getLineDataArray: function(graphDataObject) {
    return _.map(graphDataObject, function(dataPoint, index) {
      return { x: dataPoint['x'], y: dataPoint['y'].length };
    });
  },

  wordSearch: function(){
    var query = $('#search-input').val();
    _.each(this.graphObjectArray, function(dataPoint, index){
      if (dataPoint['y'].length > 0) {
        _.each(dataPoint['y'], function(wordModel, index, list){
          if (wordModel.get('letters').toLowerCase() === query.toLowerCase()) {
            this.scatterDataArray.push({ x: dataPoint['x'], y: list.length });
          }
        }.bind(this));
      }
    }.bind(this));
    graph.render();
  },

  setUpAlchemy: function(){
    var graphIntervalSeconds = new Date() - this.startDate; // total seconds length of line
    var leftSliderPct =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderPct =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTime = (leftSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var rightDateTime = (rightSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var stringToQuery = this.collection.alchemyQueryString(leftDateTime, rightDateTime);
    this.renderAlchemy(stringToQuery);
  },

  renderAlchemy: function(stringToQuery){
    $.ajax({
      url: '/alchemy_search',
      method: 'post',
      data: {
        words: stringToQuery
      },
      dataType: 'json'
    }).done(function(data){
      var sum = 0;
      _.each(data.entities, function(entity){
        sum += parseFloat(entity["relevance"]);
      });
      var entities = _.map(data.entities, function(entity){
        var value = parseFloat(entity["relevance"]);
        return {"id": (entity["text"] +" - "+entity["type"]), "size": [value/sum], "color": [value] };
      });

      this.treemap(entities);
      $('html, body').animate({
            scrollTop: $('#treemap').offset().top -80
      }, 400);
   }.bind(this));
  },

  setTickInterval: function(){
    var baseTimeInSeconds = this.endDate / 1000;
    var counter = 1;
    this.currentInterval = setInterval(function(){
      var curGraphData = this.lineDataArray;
      //smooth out graph on no talking
      var yVal = this.tempWordStorage.length === 0 ? curGraphData[curGraphData.length - 1]['y'] / this.SMOOTHING : this.tempWordStorage.length;
      this.lineDataArray.push({x: baseTimeInSeconds + (this.TICKSECONDS * counter),
                               y: yVal});
      this.tempWordStorage = [];
      graph.render();
      counter++;
    }.bind(this), this.TICKSECONDS * 1000);
  },

  setStartDate: function(){
    var selectedDate = $('.form-control').val();
    if (selectedDate === "") {
      return new Date().getTime() - (this.DEFAULTHOURSPAST*60*60*1000);
    } else {
      var startDate = new Date(selectedDate).getTime();
      if (startDate > new Date().getTime()) {
        startDate = new Date().getTime();
      }
      return startDate;
    }
  },

  initializeChart: function(){
    $('#chart_container').prepend("<div id='chart'>");
    $('#chart_container').prepend("<div id='y_axis'>");
    graph = new Rickshaw.Graph({
      element: document.querySelector("#chart"),
      renderer: 'multi',
      width: 1100,
      height: 400,
      series: [
                {
                  data: this.lineDataArray,
                  renderer: 'line',
                  color: 'steelblue'
                },
                {
                  data: this.scatterDataArray,
                  renderer: 'scatterplot',
                  color: 'red'
                }
              ]
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

  treemap: function(entities){
    $("#treemap").remove();
    $("<div id='treemap'>").insertBefore("#google-results");
    if (entities.length > 0) {
      $("#treemap").treemap({
        "nodeData": {
          "id": "group 1", "children": entities
         }
       }).bind('treemapclick', this.mouseclickhandler);
    } else {
      this.displayRelephantError();
    }
  },

  displayRelephantError: function(){
    $('<div id="RelephantError">RelephantError: No concepts found. Try adjusting your search window or recording more conversations.</div>').appendTo('#treemap');
  },

  mouseclickhandler: function(e, data){
    var nodes = data.nodes;
    var ids = data.ids;
    var type = ids[0].split(' - ')[1];
    var entity = ids[0].split(' - ')[0];
    self.googleResults(entity.toLowerCase().split(" ").join("+"));
  },

  googleResults: function(entity){
    console.log(entity);
    var resultsToPass;
    $.ajax({
      url: '/google_search',
      method: 'get',
      data: {
        entity: entity
      },
      dataType: 'json'
    }).done(function(data){
      resultsToPass = data.items;
       $(".loader").show();
      $(".loader").fadeOut(3000);
      this.googleResultsRender(resultsToPass);
      $('html, body').animate({
            scrollTop: $('#google-results').offset().top -80
      }, 400);
      $(scrollTop())
    }.bind(this));
  },

  googleResultsRender: function(results){
    $("#google-results").empty();
    _.each(results, function(result, index){
      var title = result["title"];
      var snippet = result["snippet"];
      var link = result["link"];
      $('<div id="google-result"><a href="' + link + '"><h3>' + title + '</h3></a><br><p>' + snippet + '</p></div>').appendTo('#google-results');
    });
  }
});
