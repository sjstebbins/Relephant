var WordCollection = Backbone.Collection.extend({
  model: WordModel,
  url: function(){
    // User regex to match current_user's id in "/users/3" and extract the "3"
    var curUserID = window.location.pathname.match(/\/\d+$/)[0].replace("/","");
    return "/users/" + curUserID + "/words";
  }
});
