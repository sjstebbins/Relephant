var EntityItemView = Backbone.View.extend({
  tagName: 'div',
  className: 'entity-item-view',
  events: {
    "click .entity-delete-x": "removeSelf"
  },
  initialize: function(options) {
    this.options = options || {};
    this.addHeader();
    googleImagesBox = new GoogleImagesView({query: this.options.query, liveMode: this.options.liveMode});
    googleResultBox = new GoogleResultsView({query: this.options.query, liveMode: this.options.liveMode});
    var specialBox = this.specialBox();
    this.$el.append(googleImagesBox.el);
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
  },
  addHeader: function() {
    var entity = (this.options.query).split('+').join(' ');
    this.$el.append("<i class='entity-delete-x fa fa-times-circle-o'></i>");
    this.$el.append('<h3 class="entity-title">' + entity + '</h3>');
  },
  removeSelf: function() {
    this.$el.remove();
  }
});
