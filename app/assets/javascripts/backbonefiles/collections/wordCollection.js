var WordCollection = Backbone.Collection.extend({
  model: WordModel,
  url: function(){
    // User regex to match current_user's id in "/users/3" and extract the "3"
    var curUserID = window.location.pathname.match(/\/\d+$/)[0].replace("/","");
    return "/users/" + curUserID + "/words";
  },
  graphObjectInDateTimeRange: function(startDateTime, endDateTime, interval) {
    var result = [];
    var timeIntervals = this.timeIntervals(startDateTime, endDateTime, interval);
    for (var i = 0; i < (timeIntervals.length - 1); i++) {
      var filteredWordArray = this.wordModelsFromStartToEnd(timeIntervals[i], timeIntervals[i+1]);
      result.push({x: new Date(timeIntervals[i]), y: filteredWordArray.length});
    }
    return result;
  },
  earliestTimeInRange: function(startDateTime, endDateTime){
    var filteredWordArray = this.wordModelsFromStartToEnd(startDateTime, endDateTime);
    var sortedfilteredWordArray = _.sortBy(filteredWordArray, function(word, index){
      return (new Date(Date.parse(word.get('created_at'))));
    });
    var firstWord = sortedfilteredWordArray[0];
    return new Date(Date.parse(firstWord.get('created_at')));
  },
  wordModelsFromStartToEnd: function(startDateTime, endDateTime){
    var filteredWordArray = this.filter(function(word){
      var createdAt = new Date(Date.parse(word.get('created_at')));
      return (createdAt > startDateTime && createdAt < endDateTime);
    });
    return filteredWordArray;
  },
  timeIntervals: function(startDateTime, endDateTime, interval){
    var timeIntervals = [];
    var startSecondsSinceEpoch = startDateTime.getTime() / 1000;
    var secondsRange = (endDateTime - startDateTime) / 1000;
    for (var i = 0; i < secondsRange; i+= interval) {
      timeIntervals.push(new Date((startSecondsSinceEpoch + i) * 1000));
    }
    return timeIntervals;
  }
});
