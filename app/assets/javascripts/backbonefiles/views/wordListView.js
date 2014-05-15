var graph;
var stringToQuery;

var WordListView = Backbone.View.extend({
  el: '#word-chart',
  events: {
    'click button#word-search': 'wordSearch',
    'click button#datetimebutton': 'resetTime',
    'click button#alchemy': 'setUpAlchemy',
    'click div.treemap-node': 'googleResults',
    'click button#transcript': 'generateTranscript'
  },

  initialize: function(){
    this.$('#chart_container').remove();
    $("<div id=chart_container></div>").insertBefore('#slider-range');
    this.collection.fetch();
    this.listenTo(this.collection, 'add', this.addToTempStorage);

    this.DEFAULTHOURSPAST = 1;
    this.SMOOTHING = 1.01;
    this.tempWordStorage = [];

    this.startDate = this.setStartDate();
    this.endDate = new Date().getTime(); //current time
    this.xIntervalSeconds = this.setIntervalSeconds((this.endDate - this.startDate)/1000);
    this.graphObjectArray = this.queryDBforGraphData(this.xIntervalSeconds);
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

  setIntervalSeconds: function(range){ //takes graph range in seconds
    var result;
    var seconds_in_hour = 60 * 60;
    if (range < 2 * seconds_in_hour) {
      result = 1;
    } else if (range < 24 * seconds_in_hour) {
      result = 5;
    } else if (range < 84 * seconds_in_hour) { // half a week
      result = 10;
    } else if (range < 168 * seconds_in_hour) { // one week
      result = 30;
    } else if (range < 720 * seconds_in_hour) { // one month
      result = 150;
    } else {
      result = 1200;
    }
    $('#tick-interval').text(result + " seconds");
    return result;
  },

  generateTranscript: function(){
    var graphIntervalSeconds = new Date() - this.startDate; // total seconds length of line
    var leftSliderPct =  parseFloat(document.getElementById('left-slider').style.left)/100; //left slider %
    var rightSliderPct =  parseFloat(document.getElementById('right-slider').style.left)/100; //right slider %
    var leftDateTime = (leftSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var rightDateTime = (rightSliderPct * graphIntervalSeconds + this.startDate)/1000;
    var transcript = this.collection.alchemyQueryString(leftDateTime, rightDateTime).split("+").join(" ");
    $('#transcript-box').empty();
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
    this.currentInterval = setInterval(function(){
      var curGraphData = this.lineDataArray;
      //smooth out graph on no talking
      var yVal = this.tempWordStorage.length === 0 ? curGraphData[curGraphData.length - 1]['y'] / this.SMOOTHING : this.tempWordStorage.length;
      this.lineDataArray.push({x: baseTimeInSeconds + (this.xIntervalSeconds * counter),
                               y: yVal});
      this.tempWordStorage = [];
      graph.render();
      counter++;
    }.bind(this), this.xIntervalSeconds * 1000);
  },

  setStartDate: function(){
    $('.form-control').css("border-color", "#ddd");
    $('#tick-interval').parent().find('p').remove();
    var selectedDate = $('.form-control').val();
    if (selectedDate === "") {
      return new Date().getTime() - (this.DEFAULTHOURSPAST*60*60*1000);
    } else {
      var startDate = new Date(selectedDate).getTime();
      if (startDate > new Date().getTime()) {
        $('.form-control').css("border-color", "red")
        $('#tick-interval').parent().append("<p>Time cannot be in the future</p>");
        startDate = new Date().getTime() - (this.DEFAULTHOURSPAST*60*60*1000);
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
        var wordDataPoint = _.filter(this.graphObjectArray, function(dataPoint, index){
          return dataPoint['x'] === x;
        }.bind(this));
        var words = _.map(wordDataPoint[0]['y'], function(wordModel, index){ return wordModel.get('letters'); });
        $('#legend-datetime').text(prettyDateTime(new Date(x * 1000)));
        $('#legend-words').text(words.join(", "));
      }.bind(this)
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
      $("#treemap").treemap({data: entities,
        colors: ['#2B44FF', '#75AAFF'],
        width: 1100,
        height: 300,
      });
    } else {
      this.displayRelephantError();
    }
  },

  displayRelephantError: function(){
    $('<div id="RelephantError">RelephantError: No concepts found. Try adjusting your search window or recording more conversations.</div>').appendTo('#treemap');
  },

  googleResults: function(entity){
    var resultsToPass;
    var entity = entity.target.innerText.split(" ").join("+");
    $.ajax({
      url: '/google_search',
      method: 'get',
      data: {
        entity: entity
      },
      dataType: 'json'
    }).done(function(data){
      resultsToPass = data.items;
    $(entity.target).css('background','red');
      this.googleResultsRender(resultsToPass);
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
