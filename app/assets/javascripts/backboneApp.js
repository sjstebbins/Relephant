//= require underscore
//= require backbone
//= require moment
//= require bootstrap-datetimepicker
//= require jquery.ui.slider
//= require webspeech
//= require treemap_rex
//= require_tree ./backbonefiles/models
//= require_tree ./backbonefiles/collections
//= require_tree ./backbonefiles/views
//= require backbonefiles/router

var rephantoRouter;

function backboneReady(){
  rephantoRouter = new RephantoRouter();
  rephantoRouter.start();

  setDate();
}

function setDate() {
  var today = new Date();
  var year = "" + today.getYear();
  var month = "" + today.getMonth() + 1;
  var day = "" + today.getDate();
  $('#datetimepicker1').datetimepicker();
}

$(document).ready(backboneReady);
$(document).on('page:load', function(){
  Backbone.history.stop();
  backboneReady();
});
