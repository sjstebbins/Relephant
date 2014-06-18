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
  setDate();
  runJoyride();
}

function setDate() {
  $('#datetimepicker1').datetimepicker();
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

function relephantViewPicker(entityType, query) {
  $('#entity-based-results-view').empty();
  if (entityType === 'city' || entityType === 'continent' || entityType === 'country' || entityType === 'facility' || entityType === 'geographicfeature' || entityType === 'region' || entityType === 'stateorcounty') {
    $('#entity-based-results-view').append('<div id="google-maps-view">');
    var zoomLevel = 8;
    if (entityType === 'country' || entityType === 'continent') { zoomLevel = 4; }
    new googleMapsView({googleMapsQuery: query, zoomLevel: zoomLevel});
  }
}

function displayRelephantError(content) {
  $('#RelephantError').remove();
  $('#alchemy-results-view').append('<div id="RelephantError">' + content + '</div>');
}

$(document).ready(backboneReady);
$(document).on('page:load', function(){
  Backbone.history.stop();
  backboneReady();
});
