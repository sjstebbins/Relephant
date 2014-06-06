var graph;
var stringToQuery;

var WordListView = Backbone.View.extend({
  el: '#word-chart',

  events: {
    'click button#word-search': 'wordSearch',
    'click button#datetimebutton': 'resetTime',
    'click button#alchemy': 'renderAlchemyResults',
    'click div.treemap-node': 'googleResults',
    'click button#transcript': 'generateTranscript',
    'click button#live': "startLiveChart",
    'click button#tooltip': 'startGuide'
  },

  initialize: function(){
    self = this;

    // set up listeners
    this.listenTo(this.collection, 'add', this.addToTempStorage);

    // set up defaults, constants, and dummy vars
    this.DEFAULTHOURSPAST = 1;
    this.SMOOTHING = 1.001;
    this.tempWordStorage = [];

    // clear any existing graph and fetch updated collection
    this.$('#chart_container').remove();
    $("<div id=chart_container></div>").insertBefore('#slider-range');
    this.collection.fetch();

    // set graph date range and tick interval
    this.startDate = this.setStartDate();
    this.endDate = new Date().getTime();
    this.xIntervalSeconds = this.setIntervalSeconds((this.endDate - this.startDate)/1000);

    // render graph
    this.graphObjectArray = this.queryDBforGraphData(this.xIntervalSeconds);
    this.render();
  },

  render: function(){
    this.lineDataArray = this.getLineDataArray(this.graphObjectArray);
    this.initializeChart();
    graph.render();
    this.setSlider();
    this.setTickInterval();
  },

  startGuide: function(){
    runJoyride();
  },

  startLiveChart: function(){
    // a custom 'intialize' function with specific parameters for time range and tick interval
    clearInterval(this.currentInterval);
    this.$('#chart_container').remove();
    $("<div id=chart_container></div>").insertBefore('#slider-range');
    this.collection.fetch();
    this.startDate = new Date().getTime() - 1*60*1000;
    this.endDate = new Date().getTime();
    this.xIntervalSeconds = 0.1;
    this.graphObjectArray = this.queryDBforGraphData(this.xIntervalSeconds);
    this.render();
  },

  setIntervalSeconds: function(range){ //takes graph range in seconds
    // adjusts graph's tick interval based on graph range
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
    leftSliderDateTime = this.sliderDateTimes()[0];
    rightSliderDateTime = this.sliderDateTimes()[1];
    var transcript = this.collection.wordString(leftSliderDateTime, rightSliderDateTime).split("+").join(" ");
    $('#transcript-box').empty();
    $('#transcript-box').slideDown();
    $('#transcript-box').append("<h4 id=transcript-title>Trancript from " + prettyDateTime(new Date(leftSliderDateTime*1000)) + " to " + prettyDateTime(new Date(rightSliderDateTime*1000)) + ":</h4>");
    $('#transcript-box').append("<p id=transcript-content>" + transcript + "</p>");
    $('html, body').animate({
            scrollTop: $('#transcript-box').offset().top -80
      }, 400);
  },

  // returns [leftSliderEpochTime, rightSliderEpochTime] both in seconds
  sliderDateTimes: function(){
    var graphDuration = new Date() - this.startDate;
    var leftSliderPct = parseFloat(document.getElementById('left-slider').style.left)/100;
    var rightSliderPct = parseFloat(document.getElementById('right-slider').style.left)/100;
    var leftDateTime = (leftSliderPct * graphDuration + this.startDate)/1000;
    var rightDateTime = (rightSliderPct * graphDuration + this.startDate)/1000;
    return [leftDateTime, rightDateTime];
  },

  resetTime: function(){
    this.startDate = this.setStartDate();
    clearInterval(this.currentInterval);
    this.initialize();
  },

  getLineDataArray: function(graphDataObject) {
    // returns an array of objects of the form { x: integer, y: integer }
    // where x is seconds since epoch and y is length of the word array
    return _.map(graphDataObject, function(dataPoint, index) {
      return { x: dataPoint['x'], y: dataPoint['y'].length };
    });
  },

  wordSearch: function(){
    var scatterDataArray = [{x: this.startDate/1000, y: 0}];
    var query = $('#search-input').val();
    var leftSliderDateTime = this.sliderDateTimes()[0];
    var rightSliderDateTime = this.sliderDateTimes()[1];
    _.each(this.graphObjectArray, function(dataPoint, index){
      if (dataPoint['y'].length > 0) {
        _.each(dataPoint['y'], function(wordModel, index, list){
          if (wordModel.get('letters').toLowerCase() === query.toLowerCase()) {
            if (dataPoint['x'] > leftSliderDateTime && dataPoint['x'] < rightSliderDateTime) {
              scatterDataArray.push({ x: dataPoint['x'], y: list.length });
            }
          }
        }.bind(this));
      }
    }.bind(this));
    var r = Math.floor(Math.random() * 150);
    var g = Math.floor(Math.random() * 150);
    var b = Math.floor(Math.random() * 150);
    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
    var count = scatterDataArray.length - 1;
    graph.series.push({ data: scatterDataArray, renderer: 'scatterplot', color: color });
    $('#legend').append("<div class='search-term' style='background: " + color + ";'><span class='search-count'>(" + count + ")</span> " + query + "</div>");
    graph.render();
    $('html, body').animate({
      scrollTop: $('body').offset().top + 100
    }, 400);
  },

  renderAlchemyResults: function(){
    leftSliderDateTime = this.sliderDateTimes()[0];
    rightSliderDateTime = this.sliderDateTimes()[1];
    var stringToQuery = this.collection.wordString(leftSliderDateTime, rightSliderDateTime);
    this.$('#alchemy-results-view').empty();
    new alchemyResultsView({stringToQuery: stringToQuery});
  },

  setTickInterval: function(){
    var counter = 1;
    var baseTimeInSeconds = this.endDate / 1000;
    this.currentInterval = setInterval(function(){
      var curLogTime = baseTimeInSeconds + (this.xIntervalSeconds * counter);
      var curGraphData = this.lineDataArray;
      // construct dummy "models" to use for legend, hover, search
      var wordModels = _.map(this.tempWordStorage, function(letters, index){
        return new WordModel({letters: letters});
      });
      // smooth out gaps between not talking
      var yVal = this.tempWordStorage.length === 0 ? curGraphData[curGraphData.length - 1]['y'] / this.SMOOTHING : this.tempWordStorage.length;
      // push to array that graph uses for series data
      this.lineDataArray.push({x: curLogTime, y: yVal});
      // push to graph object used for legend, hover, search
      this.graphObjectArray.push({x: curLogTime, y: wordModels});
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
        $('.form-control').css("border-color", "red");
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
        if (wordDataPoint.length > 0) {
          var words = _.map(wordDataPoint[0]['y'], function(wordModel, index){ return wordModel.get('letters'); });
          $('#legend-datetime').text(prettyDateTime(new Date(x * 1000)));
          $('#legend-words').text(words.join(" "));
        }
        return wordDataPoint[0]['y'].length > 0 ? 'word count: ' + y : 'word count: 0';
      }.bind(this)
    });
  },

  queryDBforGraphData: function(interval){
    var dataArray = [];
    leftSliderDateTime = this.sliderDateTimes()[0];
    rightSliderDateTime = this.sliderDateTimes()[1];
    var graphDataArray = this.collection.graphObjectInDateTimeRange(leftSliderDateTime, rightSliderDateTime, interval);
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
  }
});
