var EntityItemView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-item-view',
  initialize: function(options){
    this.options = options || {};
    googleResultBox = new GoogleResultsView({query: this.options.query, liveMode: this.options.liveMode});
    var specialBox = this.specialBox();
    this.$el.append(googleResultBox.el);
    this.$el.append(specialBox);
  },
  specialBox: function() {
    var entityType = this.options.type;
    if (entityType === 'city' || entityType === 'continent' || entityType === 'country' || entityType === 'facility' || entityType === 'geographicfeature' || entityType === 'region' || entityType === 'stateorcounty') {
      var zoomLevel = 8;
      if (entityType === 'country' || entityType === 'continent') { zoomLevel = 4; }
      var googleMapsView = new GoogleMapsView({googleMapsQuery: this.options.query, zoomLevel: zoomLevel});
      return googleMapsView.el;
    } else if (entityType === 'company') {
      var crunchBaseView = new CrunchBaseView({query: this.options.query});
      return crunchBaseView.el;
    }
  }

});
