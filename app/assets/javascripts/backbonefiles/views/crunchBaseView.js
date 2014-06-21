var CrunchBaseView = Backbone.View.extend({
  tagName: 'div',
  className: 'crunchbase-view',

  initialize: function(options){
    this.options = options || {};
    this.queryCrunchbase();
  },

  queryCrunchbase: function(){
    $.ajax({
      url: '/crunchbase_search',
      method: 'get',
      data: {
        query: this.options.query
      },
      dataType: 'json'
    }).done(function(data){
      if (data.error === undefined) {
        this.description = data.data.properties.short_description;
        this.foundedYear = data.data.properties.founded_year;
        this.homepageURL = data.data.properties.homepage_url;
        this.headquartersCity = data.data.relationships.headquarters.items[0].city;
        this.headquartersRegion = data.data.relationships.headquarters.items[0].region;
        this.render();
      }
    }.bind(this));
  },

  render: function(){
    this.$el.append('<p><span class="crunch-bold">Description: </span>' + this.description + '</p>');
    this.$el.append('<p><span class="crunch-bold">Founded: </span>' + this.foundedYear + '</p>');
    this.$el.append('<p>' + this.headquartersCity + ', ' + this.headquartersRegion + '</p>');
    this.$el.append('<p><span class="crunch-bold">Homepage: </span>' + '<a href="' + this.homepageURL + '">' + this.homepageURL + '</a></p>');
  }
});
