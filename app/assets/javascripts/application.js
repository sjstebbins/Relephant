// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//= require rickshaw_with_d3
//= httparty
//= require jquery
//= require jquery_ujs
//= require treemap_rex
//= require turbolinks

// move to separate file
function ready() {
  $(".loader").fadeOut(3000);
  $('#user-name').hide();
  $('nav').on("mouseenter", function(){
    $('#user-name').fadeIn('slow');
  });
  $('nav').on("mouseleave", function(){
    $('#user-name').fadeOut('slow');
  });
}

$(document).ready(ready);
$(document).on('page:load', ready);

$(window).scroll(function(){
    currentoffset = $(this).scrollTop();
    if (currentoffset>100) {
      var navHeight = $("#navbar").height();
      var resultsMargin = $("#results").css('margin-top');
      $("#navbar").css('height', (navHeight * .97));
      $("#results").css('margin-top', (resultsMargin *.97));
      $("#navbar").css('background-color', 'rgba(255,255,255,.8)');

    }
      // $('#logo-text').text().css('left', (currentoffset/200) + 'px');


});



 // thisoffset = currentoffset - 50*(currentoffset/200);
      // scale = (currentoffset*(.001)) +1;
      // $("#navbar").css({top:thisoffset,transform:"scale("+scale+")"});
