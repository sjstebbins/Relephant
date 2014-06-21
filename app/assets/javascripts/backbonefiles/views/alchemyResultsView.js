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
      // limit to first 10 entities
      _.each(data.entities.slice(0, 10), function(entity){
        sum += parseFloat(entity["relevance"]);
      });
      var entities = _.map(data.entities, function(entity){
        var value = parseFloat(entity["relevance"]);
        var color = Math.random();
        // Use following line in place of line above to have color match relevance number
        // var color = parseFloat(entity["relevance"]);
        return {"id": (entity["text"] + " - " + entity["type"]), "size": [value/sum], "color": [color], "relevance": value };
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
        $('#entity-results').empty();
        //entities are sorted by relevance, display top 3 entities
        for (var i = 0; i < 3; i++) {
          if (entities[i] !== undefined) {
            var entity = entities[i].id.split(' - ')[0];
            var type = entities[i].id.split(' - ')[1].toLowerCase();
            var query = entity.toLowerCase().split(" ").join("+");
            var entityItem = new EntityItemView({type: type, query: query, liveMode: this.options.liveMode});
            $('#entity-results').append(entityItem.$el);
          }
        }
      } else {
        $('html, body').animate({
          scrollTop: $('#treemap').offset().top - 80
        }, 400);
      }
    } else {
      this.renderRelephantError();
    }
  },

  mouseclickhandler: function(e, data){
    var nodes = data.nodes;
    var ids = data.ids;
    var entity = ids[0].split(' - ')[0];
    var type = ids[0].split(' - ')[1].toLowerCase();
    var query = entity.toLowerCase().split(" ").join("+");
    var entityItem = new EntityItemView({type: type, query: query});
    $('#entity-results').append(entityItem.$el);
  },

  renderRelephantError: function(){
    var errorContent;
    if (this.options.liveMode) {
      errorContent = "Speak More";
    } else {
      errorContent = "RelephantError: No concepts found. Try adjusting your search window or recording more conversations.";
    }
    displayRelephantError(errorContent);
  },
});
