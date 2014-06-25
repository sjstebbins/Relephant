// Necessary to communicate with webspeech library
var reco = new WebSpeechRecognition();

var RephantoRouter = Backbone.Router.extend({
  routes: {
    "":"live",
    "history":"history"
  },
  initialize: function(){
    this.collection = new WordCollection();
    this.speechInputView = new SpeechInputView({ collection: this.collection });
  },
  start: function(){
    Backbone.history.start();
  },
  live: function(){
    reco.start();
  },
  history: function(){
    reco.stop();
    this.wordListView = new WordListView({ collection: this.collection });
  }
});

//Router should handle:

//1 mapping of routes to functions (controller actions)
//2 contain controller functions (used in (1))
//2a fetch data, manipulate data- using models/collections functions
//2b manage state of views on page (maybe)
