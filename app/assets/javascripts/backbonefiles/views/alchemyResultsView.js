var alchemyResultsView = Backbone.View.extend({
  el: '#alchemy-results-view',

  events: {

  },

  initialize: function(options){
    // set passed in options
    this.options = options || {};

    // query API for relevant concepts if there is a string to query
    if (this.options.stringToQuery !== '') {
      this.queryAlchemy(this.options.stringToQuery);
    }
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
      if (this.options.liveMode) {
        // entitySelection should be based on most relevant result
        // since all relevnace values are equal, we use random index number
        var entitySelection = Math.floor(Math.random() * entities.length);

        var entity = entities[entitySelection].id.split(' - ')[0];
        var type = entities[0].id.split(' - ')[1].toLowerCase();
        var query = entity.toLowerCase().split(" ").join("+");
        new GoogleResultsView({query: query, liveMode: this.options.liveMode});
        relephantViewPicker(type, query);
      } else {
        $('html, body').animate({
          scrollTop: $('#treemap').offset().top - 80
        }, 400);
      }
    } else {
      this.displayRelephantError();
    }
  },

  mouseclickhandler: function(e, data){
    var nodes = data.nodes;
    var ids = data.ids;
    var entity = ids[0].split(' - ')[0];
    var type = ids[0].split(' - ')[1].toLowerCase();
    var query = entity.toLowerCase().split(" ").join("+");
    new GoogleResultsView({query: query});
    relephantViewPicker(type, query);
  },

  displayRelephantError: function(){
    $('#treemap').append('<div id="RelephantError">RelephantError: No concepts found. Try adjusting your search window or recording more conversations.</div>');
  },
});
