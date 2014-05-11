var WordListView = Backbone.View.extend({
  className: 'word-graph',
  initialize: function(){
    this.template = _.template($('#graph-template').html());
    this.render();
    //set up listeners to update graph whenever collection has additions

    //not sure if next line is necessary
    this.listenTo(this.collection, 'reset', this.render);
  },
  render: function(){
    var compiledView = this.template(this.collection.toJSON());
    this.$el.html(compiledView);
  },
  // addOne will eventually be "update graph" or "appendToGraph"
  addOne: function(){
  }
});
