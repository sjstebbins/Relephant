var GoogleImagesView = Backbone.View.extend({
  tagName: 'div',
  className: 'google-images-view',

  initialize: function(options){
    this.options = options || {};
    this.queryGoogle(this.options.query);
  },

  queryGoogle: function(entity){
    var resultsToPass;
    $.ajax({
      url: '/google_image_search',
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
      var imgURL = result.link;
      this.$el.append('<a class="google-image-link" href="' + imgURL + '" target="_blank"><img class="google-image-image" src="' + imgURL + '"></a>');
    }.bind(this));
  }

});


