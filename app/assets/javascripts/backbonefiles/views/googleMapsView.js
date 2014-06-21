var GoogleMapsView = Backbone.View.extend({
  tagName: 'div',
  className: 'google-maps-view',

  initialize: function(options){
    this.options = options || {};
    this.geocode();
  },

  geocode: function(){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.options.googleMapsQuery }, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.k;
          var lon = results[0].geometry.location.A;
          this.initializeMap(lat, lon);
        }
      }.bind(this));
  },

  initializeMap: function(lat, lon){
    var randomID = '' + Math.random();
    this.$el.html('<div class="map-canvas" id="' + randomID + '"></div>');
    var centerPoint = new google.maps.LatLng(lat, lon);
    var mapOptions = {
      zoom: this.options.zoomLevel,
      center: centerPoint,
      scrollwheel: false
    };
    var map = new google.maps.Map(document.getElementById(randomID), mapOptions);
    var marker = new google.maps.Marker({
      position: centerPoint,
      map: map
    });
  }

});
