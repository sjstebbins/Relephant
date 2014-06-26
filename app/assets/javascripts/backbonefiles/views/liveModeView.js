var LiveModeView = Backbone.View.extend({
  el: '#live-mode',

  initialize: function(){
    this.setPlaceHolder();
    this.setQueryInterval();
  },

  setPlaceHolder: function(){
    this.$el.append('<div id="placeholder"><h3>Speak</h3></div>');
  },

  setQueryInterval: function(){
    clearInterval(this.currentQueryInterval);
    this.currentQueryInterval = setInterval(function(){

    })
  }
});

//might need to use custom close method to clear intervals
