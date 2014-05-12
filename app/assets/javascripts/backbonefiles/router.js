var RephantoRouter = Backbone.Router.extend({
  routes: {
    "":"show"
  },
  initialize: function(){
    this.collection = new WordCollection();
  },
  start: function(){
    Backbone.history.start();
  },
  show: function(){
    this.collection.fetch({
      success: function(){
        this.speechInputView = new SpeechInputView({ collection: this.collection });
        this.wordListView = new WordListView({ collection: this.collection });
      }.bind(this)
    });
  }
});

//Router should handle:

//1 mapping of routes to functions (controller actions)
//2 contain controller functions (used in (1))
//2a fetch data, manipulate data- using models/collections functions
//2b manage state of views on page (maybe)
