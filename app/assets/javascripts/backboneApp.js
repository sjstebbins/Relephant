//= require underscore
//= require backbone
//= require moment
//= require bootstrap-datetimepicker
//= require jquery.ui.slider
//= require webspeech
//= require treemap
//= require jquery.joyride-2.1
//= require_tree ./backbonefiles/models
//= require_tree ./backbonefiles/collections
//= require_tree ./backbonefiles/views
//= require backbonefiles/router

var rephantoRouter;

function backboneReady(){
  rephantoRouter = new RephantoRouter();
  rephantoRouter.start();
  runJoyride();
  initializeToolTip();
}

function prettyDateTime(dateTime) {
  return dateTime.toDateString() + " at " + dateTime.toLocaleTimeString();
}

function runJoyride() {
  $("#joyRideTipContent").joyride({
    'nextButton': true,              // true/false for next button visibility
    'tipAnimation': 'pop',           // 'pop' or 'fade' in each tip
    'cookieMonster': true,           // true/false for whether cookies are used
    'cookieName': 'JoyRide',         // choose your own cookie name
  });
}

function initializeToolTip() {
  $('#tooltip a').click(function(){
    runJoyride();
  });
}

$(document).ready(backboneReady);
$(document).on('page:load', function(){
  Backbone.history.stop();
  backboneReady();
});
