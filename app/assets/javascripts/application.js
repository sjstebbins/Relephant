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
  $(".loader").fadeOut(3000);
  //Hide Treemap
  $('#treemap').hide();


  // Search
  $('#search').fadeIn(5000);
  $('#search').animate({"margin-top": "-90px"}, 5000);
  $('#results').fadeIn(5000);
  $('#results').animate({"margin-top": "70px"}, 5000);
  // $('#search-input').keypress(function(e){
        // if (e.which === 13 || e.which === 27) {//Enter key pressed
            // $('#word-search').click();//Trigger search button click event
            // $('#search').animate({"margin-top": "-180px"}, 1000);
            // $('#search').fadeOut();
          // }
        // });


    // Set Time
    $('#datetimebutton').on('click', function(){
      $(".loader").show();
      $(".loader").fadeOut(3000);
    });

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
    $('#entity-nav-image').on('click', function(){
      $('#entity-nav-image').toggleClass('entity-nav-click');
      $('.google-image-view').slideToggle();
    });
    $('#entity-nav-google').on('click', function(){
      $('#entity-nav-google').toggleClass('entity-nav-click');
      $('.google-results-view').slideToggle();
    });
    $('#entity-nav-map').on('click', function(){
      $('#entity-nav-map').toggleClass('entity-nav-click');
      $('.google-maps-view').slideToggle();
    });



  $(window).scroll(function(){
    currentoffset = $(this).scrollTop();
    var navHeight = $("#navbar").height();
    if (currentoffset > 30) {
      // Nav and mic animation

      $("#navbar").animate({height: '65px'}, 3000);
      $("#navbar").css('background-color', 'rgba(255,255,255,1)');
      $('#search').css('box-shadow', '0px 0px 5px 5px rgba(68,68,68,0.2)');

    } else {
      $("#navbar").animate({height: '80px'}, 3000);
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
