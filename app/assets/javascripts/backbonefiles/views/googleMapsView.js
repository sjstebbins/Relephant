var googleMapsView = Backbone.View.extend({
  el: 'div#google-maps-view',

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
    $('#google-maps-view').append('<div class="map-canvas" id="map-canvas"></div>');
    var centerPoint = new google.maps.LatLng(lat, lon);
    var mapOptions = {
      zoom: this.options.zoomLevel,
      center: centerPoint
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.Marker({
      position: centerPoint,
      map: map
    });
  }

});
