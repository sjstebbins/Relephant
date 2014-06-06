var GoogleResultsView = Backbone.View.extend({

  el: '#google-results-view',

  initialize: function(options){
    this.options = options || {};
    this.queryGoogle(this.options.query);
  },

  queryGoogle: function(entity){
    var resultsToPass;
    $.ajax({
      url: '/google_search',
      method: 'get',
      data: {
        entity: entity
      },
      dataType: 'json'
    }).done(function(data){
      resultsToPass = data.items;
      this.renderResults(resultsToPass);
      $('html, body').animate({
        scrollTop: $('#google-results-view').offset().top - 80
      }, 400);
    }.bind(this));
  },

  renderResults: function(results){
    this.$el.empty();
    _.each(results, function(result, index){
      var title = result["title"];
      var snippet = result["snippet"];
      var link = result["link"];
      this.$el.append($('<div id="google-result"><a href="' + link + '"><h3>' + title + '</h3></a><br><p>' + snippet + '</p></div>'));
    }.bind(this));
  }

});
