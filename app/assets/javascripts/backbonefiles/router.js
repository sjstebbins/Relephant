// Necessary to communicate with webspeech library
var reco = new WebSpeechRecognition();

var RephantoRouter = Backbone.Router.extend({
  routes: {
    "":"live",
    "history":"history"
  },
  initialize: function(){
    this.collection = new WordCollection();
  },
  start: function(){
    Backbone.history.start();
  },
  live: function(){
    // remove history view if present
    if (this.speechInputView !== undefined) { this.speechInputView.close(); }
    if (this.wordListView !== undefined) { this.wordListView.close(); }
    $('#alchemy-results-view').empty();
    $('#entity-results').empty();

    this.speechInputView = new SpeechInputView({ collection: this.collection, liveMode: true });
  },
  history: function(){
    // remove live view if present
    if (this.speechInputView !== undefined) { this.speechInputView.close(); }
    $('#alchemy-results-view').empty();
    $('#entity-results').empty();

    reco.stop();
    this.speechInputView = new SpeechInputView({ collection: this.collection, liveMode: false });
    this.collection.fetch({
      success: function(){
      this.wordListView = new WordListView({ collection: this.collection });
    }.bind(this)});
  }
});

//Router should handle:

//1 mapping of routes to functions (controller actions)
//2 contain controller functions (used in (1))
//2a fetch data, manipulate data- using models/collections functions
//2b manage state of views on page (maybe)
