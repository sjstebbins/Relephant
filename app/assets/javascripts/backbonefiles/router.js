var RephantoRouter = Backbone.Router.extend({
  routes: {
    //maybe make naming more semantic
    //is this a problem since it uses '#'
    "":"show"
  },
  initialize: function(){
    this.collection = new WordCollection();
  },
  start: function(){
    Backbone.history.start();
  },
  show: function(){
    console.log('made it to router show');
    // Might need "formView" that is the google microphone icon
    this.collection.fetch({
      success: function(){
        this.wordList = new WordListView({ collection: this.collection });
        $('#word-chart').html(this.wordList.el);
      }.bind(this)
    });
  }
});

//Router should handle:

//1 mapping of routes to functions (controller actions)
//2 contain controller functions (used in (1))
//2a fetch data, manipulate data- using models/collections functions
//2b manage state of views on page (maybe)
