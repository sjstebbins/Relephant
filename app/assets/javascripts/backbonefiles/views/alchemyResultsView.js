var AlchemyResultsView = Backbone.View.extend({
  el: '#alchemy-results-view',

  events: {
  },

  initialize: function(options){
    // necessary to use 'this' in mouseclickhandler
    alchemyResultsSelf = this;

    this.options = options || {};
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
      var entityNav = _.template($('#entity-nav-template').html());
      this.$el.append(entityNav);
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
      $(window).on('resize', function(){
        $('canvas').width(window.innerWidth - 100);
      });
    } else {
      this.displayNoEntitiesError();
    }
  },

  mouseclickhandler: function(e, data){
    var nodes = data.nodes;
    var ids = data.ids;
    var entity = ids[0].split(' - ')[0].toLowerCase();
    var type = ids[0].split(' - ')[1].toLowerCase();
    if (alchemyResultsSelf.entityDisplayed(entity)) {
      $('html, body').animate({
        scrollTop: $("h3:contains(" + entity + ")").offset().top - 80
      });
    } else {
      var query = entity.split(" ").join("+");
      var entityItem = new EntityItemView({type: type, query: query});
      $('#entity-results').prepend(entityItem.$el);
      $('html, body').animate({
        scrollTop: $('#entity-results').offset().top - 80
      });
    }
  },
  // query param should be lowercase with spaces
  entityDisplayed: function(entity) {
    var currentEntities = $('.entity-title').map(function() {
      return $(this).text();
    });
    return $.makeArray(currentEntities).indexOf(entity) !== -1;
  },

  hideTranscript: function(){
  if ($('#treemap-button').text() == "Show Treemap") {
        $('#treemap-button').text("Hide Treemap");
        $('#treemap').slideDown();
      } else {
       $('#treemap-button').text("Show Treemap");
       $('#treemap').slideUp();
     }
  },

  displayNoEntitiesError: function(){
    $('#RelephantError').remove();
    this.$el.append('<div id="RelephantError">No entities were detected</div>');
  }
});
