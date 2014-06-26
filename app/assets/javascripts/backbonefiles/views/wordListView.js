var graph;

var WordListView = Backbone.View.extend({
  el: '#history-mode',

  events: {
    'click button#datetimebutton': 'resetTime',
    'click button#word-search': 'wordSearch',
    'click button#transcript': 'generateTranscript',
    'click button#alchemy': 'renderAlchemyResults',
    'click div.treemap-node': 'googleResults',
  },

  initialize: function(){
    this.template = _.template($('#word-chart-template').html());
    this.$el.html(this.template);
    this.viewInitializer();
  },

  //need a custom initializer to differentiate initial page view vs resetting time
  viewInitializer: function(){

    // setup bootstrap datetimepicker
    $('#datetimepicker1').datetimepicker();

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
    if ($('#transcript').text() == "Generate Transcript") {
        $('#transcript-box').empty();
        $('#transcript').text("Hide Transcript");
        $('#transcript-box').slideDown();
        $('#transcript-box').append("<h4 id=transcript-title>Transcript from " + prettyDateTime(new Date(leftSliderDateTime*1000)) + " to " + prettyDateTime(new Date(rightSliderDateTime*1000)) + ':</h4><div id="email"><a href="mailto:'  + '?&subject=Transcript%20from%20' + prettyDateTime(new Date(leftSliderDateTime*1000)) + '%20to%20' + prettyDateTime(new Date(rightSliderDateTime*1000)) + '&body=' + transcript + '">Email <i class="fa fa-share"></i></a></div>');
        $('#transcript-box').append('<div id="email"><a href="mailto:'  + '?&subject=Transcript%20from%20' + prettyDateTime(new Date(leftSliderDateTime*1000)) + '%20to%20' + prettyDateTime(new Date(rightSliderDateTime*1000)) + '&body=' + transcript + '>Email <i class="fa fa-share"></i></a></div><p id=transcript-content>' + transcript + '</p>');
      } else {
       $('#transcript').text("Generate Transcript");
       $('#transcript-box').slideUp();
     }

    // "<div id='email'><a href='mailto:" + user_name +"@? subject= Transcript from " + prettyDateTime(new Date(leftSliderDateTime*1000)) + " to " + prettyDateTime(new Date(rightSliderDateTime*1000)) + "&body=" + transcript + "'><i class='fa fa-paper-plane'></i></a></div>"
    $('html, body').animate({
        scrollTop: $('#transcript-box').offset().top - 80
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
    this.viewInitializer();
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
    if (query !== '') {
      var leftSliderDateTime = this.sliderDateTimes()[0];
      var rightSliderDateTime = this.sliderDateTimes()[1];
      _.each(this.graphObjectArray, function(dataPoint, index){
        if (dataPoint['y'].length > 0) {
          _.each(dataPoint['y'], function(wordModel, index, list){
            if (wordModel.get('letters').toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              if (dataPoint['x'] > leftSliderDateTime && dataPoint['x'] < rightSliderDateTime) {
                scatterDataArray.push({ x: dataPoint['x'], y: list.length });
              }
            }
          }.bind(this));
        }
      }.bind(this));
      var r = Math.floor(Math.random() * 200);
      var g = Math.floor(Math.random() * 200);
      var b = Math.floor(Math.random() * 255);
      var color = 'rgb(' + r + ',' + g + ',' + b + ')';
      var count = scatterDataArray.length - 1;
      graph.series.push({ data: scatterDataArray, renderer: 'scatterplot', color: color });
      $('#legend').append("<div class='search-term' style='background: " + color + ";'><span class='search-count'>(" + count + ")</span> " + query + "</div>");
      graph.render();
      $('html, body').animate({
        scrollTop: $('body').offset().top + 150
      }, 400);
    }
  },

  renderAlchemyResults: function(){
    leftSliderDateTime = this.sliderDateTimes()[0];
    rightSliderDateTime = this.sliderDateTimes()[1];
    var stringToQuery = this.collection.wordString(leftSliderDateTime, rightSliderDateTime);
    if (stringToQuery === '') {
      this.displayNoWordsError();
      $('html, body').animate({
        scrollTop: $('#alchemy-results-view').offset().top + 100
      }, 400);
    } else {
      $('#alchemy-results-view').empty();
      new AlchemyResultsView({stringToQuery: stringToQuery, liveMode: false});
    }
  },

  displayNoWordsError: function(){
    $('#alchemy-results-view').empty();
    this.$el.append('<div id="RelephantError">No words detected, please adjust your view</div>');
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
    var selectedDate = $('.form-control').val();
    if (selectedDate === "") {
      return new Date().getTime() - (this.DEFAULTHOURSPAST*60*60*1000);
    } else {
      var startDate = new Date(selectedDate).getTime();
      if (startDate > new Date().getTime()) {
        $('.form-control').css("border-color", "red");
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
      width: window.innerWidth - 150,
      height: 400,
      series: [
      {
        data: this.lineDataArray,
        renderer: 'line',
        color: 'steelblue'
      }
      ]
    });

    // make width responsive
    $(window).on('resize', function(){
      graph.configure({
        width: window.innerWidth - 150,
      });
      graph.render();
      $('#slider-range').width(window.innerWidth - 150);
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
  },

  close: function(){
    clearInterval(this.currentInterval);
    this.$el.empty();
  }
});
