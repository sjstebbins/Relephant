var WordCollection = Backbone.Collection.extend({
  model: WordModel,

  url: function(){
    // User regex to match current_user's id in "/users/3" and extract the "3"
    var curUserID = window.location.pathname.match(/\/\d+$/)[0].replace("/","");
    return "/users/" + curUserID + "/words";
  },

  // All date args and returns should be in seconds since epoch

  graphObjectInDateTimeRange: function(startDateTimeSeconds, endDateTimeSeconds, interval) {
    var result = [];
    var timeIntervals = this.timeIntervals(startDateTimeSeconds, endDateTimeSeconds, interval);
    for (var i = 0; i < timeIntervals.length; i++) {
      var filteredWordArray = this.wordModelsFromStartToEnd(timeIntervals[i], timeIntervals[i+1]);
      //Rickshaw needs time in seconds
      result.push({x: timeIntervals[i], y: filteredWordArray});
    }
    return result;
  },

  wordModelsFromStartToEnd: function(startDateTimeSeconds, endDateTimeSeconds){
    var filteredWordArray = this.filter(function(word){
      var createdAtInSeconds = new Date(Date.parse(word.get('created_at'))).getTime() / 1000;
      return (createdAtInSeconds > startDateTimeSeconds && createdAtInSeconds < endDateTimeSeconds);
    });
    return filteredWordArray;
  },

  timeIntervals: function(startDateTimeSeconds, endDateTimeSeconds, interval){
    var timeIntervals = [];
    var secondsRange = endDateTimeSeconds - startDateTimeSeconds;
    for (var i = 0; i < secondsRange; i+= interval) {
      timeIntervals.push(startDateTimeSeconds + i);
    }
    return timeIntervals;
  },

  earliestTimeInRange: function(startDateTimeSeconds, endDateTimeSeconds){
    var filteredWordArray = this.wordModelsFromStartToEnd(startDateTimeSeconds, endDateTimeSeconds);
    var sortedfilteredWordArray = _.sortBy(filteredWordArray, function(word, index){
      return (new Date(Date.parse(word.get('created_at'))));
    });
    var firstWord = sortedfilteredWordArray[0];
    return (new Date(Date.parse(firstWord.get('created_at'))).getTime() / 1000);
  },

  alchemyQueryString: function(startDateTimeInSeconds, endDateTimeInSeconds){
    var arrayOfModels = this.wordModelsFromStartToEnd(startDateTimeInSeconds, endDateTimeInSeconds);
    var results = _.map(arrayOfModels, function(wordModel){
                    return wordModel.get('letters');
                  });
    return results.join("+");
  }
});
