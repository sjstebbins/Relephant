//= require underscore
//= require backbone
//= require_tree ./backbonefiles/models
//= require_tree ./backbonefiles/collections
//= require_tree ./backbonefiles/views
//= require backbonefiles/router

function backboneReady(){
  var rephantoRouter = new RephantoRouter();
  rephantoRouter.start();
}

$(document).ready(backboneReady);
$(document).on('page:load', backboneReady);
