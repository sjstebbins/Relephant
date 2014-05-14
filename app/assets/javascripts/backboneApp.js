//= require underscore
//= require backbone
//= require jquery.ui.slider
//= require webspeech
//= require treemap_rex
//= require_tree ./backbonefiles/models
//= require_tree ./backbonefiles/collections
//= require_tree ./backbonefiles/views
//= require backbonefiles/router
//= require moment
//= require bootstrap-datetimepicker
var rephantoRouter;

function backboneReady(){
  rephantoRouter = new RephantoRouter();
  rephantoRouter.start();
}

$(document).ready(backboneReady);
$(document).on('page:load', function(){
  Backbone.history.stop();
  backboneReady();
});
