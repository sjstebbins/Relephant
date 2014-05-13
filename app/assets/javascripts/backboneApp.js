//= require underscore
//= require backbone
//= require bootstrap-datepicker.js
//= require jquery.ui.slider
//= require webspeech
//= require_tree ./backbonefiles/models
//= require_tree ./backbonefiles/collections
//= require_tree ./backbonefiles/views
//= require backbonefiles/router

var rephantoRouter = new RephantoRouter();

function backboneReady(){
  rephantoRouter.start();
}

$(document).ready(backboneReady);
$(document).on('page:load', function(){
  Backbone.history.stop();
  backboneReady();
});
