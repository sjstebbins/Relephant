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

function ready(){
  // Loader
  // $(".loader").fadeOut(3000);
  //Hide Treemap
  $('#treemap').hide();


  // Search
  // $('#search').fadeIn(2000);
  // $('#search').animate({"margin-top": "-90px"}, 2000);
  // $('#results').fadeIn(2000);
  // $('#results').animate({"margin-top": "70px"}, 2000);
  // $('#search-input').keypress(function(e){
        // if (e.which === 13 || e.which === 27) {//Enter key pressed
            // $('#word-search').click();//Trigger search button click event
            // $('#search').animate({"margin-top": "-180px"}, 1000);
            // $('#search').fadeOut();
          // }
        // });


    // Set Time
    // $('#datetimebutton').on('click', function(){
    //   $(".loader").show();
    //   $(".loader").fadeOut(3000);
    // });

  // Transcript
  $('#transcript-box').hide();

  // Scroller
  $("#scroller").hide();
  $("#scroller").click(function(){
    var body = $("body");
    var top = body.scrollTop();
    if (top !== 0) {
      body.animate({
        scrollTop: 100
      }, '500');
    }
  });

  // Entity Nav Click
    $('#alchemy-results-view').on('click', '#entity-nav-image', function(){
      $('#entity-nav-image').toggleClass('entity-nav-click');
      $('.google-images-view').slideToggle();
    });
    $('#alchemy-results-view').on('click', '#entity-nav-google', function(){
      $('#entity-nav-google').toggleClass('entity-nav-click');
      $('.google-results-view').slideToggle();
    });
    $('#alchemy-results-view').on('click', '#entity-nav-map', function(){
      $('#entity-nav-map').toggleClass('entity-nav-click');
      $('.google-maps-view').slideToggle();
    });

  $(window).scroll(function(){
    currentoffset = $(this).scrollTop();
    var navHeight = $("#navbar").height();
    if (currentoffset > 30) {
      // Nav and mic animation
      $("#navbar").css('background-color', 'rgba(255,255,255,1)');
    } else {
      $("#navbar").css('background-color', 'white');
      $('#search').removeAttr('box-shadow');
    }

      // Scroller
      if (currentoffset > 100) {
        $("#scroller").fadeIn();
      } else {
        $('#scroller').fadeOut();
      }

  });
}

$(document).ready(ready);
$(document).on('page:load', ready);
