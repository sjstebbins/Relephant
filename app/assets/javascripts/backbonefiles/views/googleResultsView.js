var GoogleResultsView = Backbone.View.extend({
  tagName: 'div',
  className: 'google-results-view',

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
      var resultsToPass = data.items;
      this.render(resultsToPass);
    }.bind(this));
  },

  render: function(results){
    _.each(results, function(result, index){
      var title = result.title;
      var snippet = result.snippet;
      var link = result.link;
      this.$el.append($('<div class="google-result-item"><a target="_blank" class="google-result-link" href="' + link + '">' + title + '</a><p class="google-result-description">' + snippet + '</p></div>'));
    }.bind(this));
  }

});


