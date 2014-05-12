var WordListView = Backbone.View.extend({
  className: 'word-graph',
  events: {
    'click #click': 'logDates'
  },
  initialize: function(){
    this.template = _.template($('#graph-template').html());
    this.listenTo(this.collection, 'add', this.render);
    this.render();
    //set up listeners to update graph whenever collection has additions

    //not sure if next line is necessary
    this.listenTo(this.collection, 'reset', this.render);
  },
  render: function(){
    this.collection.fetch();
    var compiledView = this.template(this.collection.toJSON());
    this.$el.html(compiledView);
  },
  // addOne will eventually be "update graph" or "appendToGraph"
  addOne: function(wordModel){
  }
});
