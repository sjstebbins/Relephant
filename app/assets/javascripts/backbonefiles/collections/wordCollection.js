var WordCollection = Backbone.Collection.extend({
  model: WordModel,
  url: function(){
    // User regex to match current_user's id in "/users/3" and extract the "3"
    var curUserID = window.location.pathname.match(/\/\d+$/)[0].replace("/","");
    return "/users/" + curUserID + "/words";
  },
  inDateTimeRange: function(startDateTime, endDateTime, interval) {
    var result = {};
    var timeIntervals = this.timeIntervals(startDateTime, endDateTime, interval);
    for (var i = 0; i < (timeIntervals.length - 1); i++) {
      var filteredWordArray = this.filter(function(word){
        var createdAt = new Date(Date.parse(word.get('created_at')));
        return (createdAt > timeIntervals[i] && createdAt < timeIntervals[i+1]);
      });
      result[new Date(timeIntervals[i]).toString()] = filteredWordArray;
    }
    return result;
  },
  timeIntervals: function(startDateTime, endDateTime, interval){
    var timeIntervals = [];
    var startSecondsSinceEpoch = startDateTime.getTime() / 1000;
    var secondsRange = (endDateTime - startDateTime) / 1000;
    for (var i = 0; i < secondsRange; i+= 30) {
      timeIntervals.push(new Date((startSecondsSinceEpoch + i) * 1000));
    }
    return timeIntervals;
  }
});
