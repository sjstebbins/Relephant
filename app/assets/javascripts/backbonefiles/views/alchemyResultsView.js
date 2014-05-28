var alchemyResultsView = Backbone.View.extend({
  el: '#alchemy-results-view',

  events: {

  },

  initialize: function(options){
    // set passed in options
    this.options = options || {};

    // query API for relevant concepts
    this.queryAlchemy(this.options.stringToQuery);
  },

  queryAlchemy: function(stringToQuery){
    $.ajax({
      url: '/alchemy_search',
      method: 'post',
      data: {
        words: stringToQuery
      },
      dataType: 'json'
    }).done(function(data){
      var sum = 0;
      _.each(data.entities, function(entity){
        sum += parseFloat(entity["relevance"]);
      });
      var entities = _.map(data.entities, function(entity){
        var value = parseFloat(entity["relevance"]);
        var color = Math.random();
        return {"id": (entity["text"] + " - " + entity["type"]), "size": [value/sum], "color": [color] };
      });

      this.renderTreemap(entities);

    }.bind(this));
  },

  renderTreemap: function(entities){
    this.$el.empty();
    this.$el.append("<div id='treemap'>");
    if (entities.length > 0) {
      $("#treemap").treemap({
        "nodeData": {
          "id": "group 1", "children": entities
        }
      }).bind('treemapclick', this.mouseclickhandler);
    } else {
      this.displayRelephantError();
    }
    $('html, body').animate({
      scrollTop: $('#treemap').offset().top - 80
    }, 400);
  },

  displayRelephantError: function(){
    $('#treemap').append('<div id="RelephantError">RelephantError: No concepts found. Try adjusting your search window or recording more conversations.</div>');
  },
});
