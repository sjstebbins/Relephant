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

// move to separate file
function ready(){
  // Loader
  $(".loader").fadeOut(3000);
  // Search
 $('#search').fadeIn(3000);
  $('#search').animate({"margin-top": "-110px"}, 3000);
  $('#search-input').keypress(function(e){
        if(e.which === 13 || e.which === 27){//Enter key pressed
            $('#word-search').click();//Trigger search button click event
            $('#search').animate({"margin-top": "-180px"}, 1000);
            $('#search').fadeOut();
             }
    });

    // Set Time
    $('#datetimebutton').on('click', function(){
    $(".loader").show();
    $(".loader").fadeOut(3000);
  });
  // $('#word-chart').on('click', function(){
  //   $('#search').animate({"margin-top": "-180px"}, 1000);
  //   $('#search').fadeOut();
  // });



  // Transcript
  $('#transcript-box').hide();
  // Scroller
  $("#scroller").hide();
  $("#scroller").click(function(){
    var body = $("body");
    var top = body.scrollTop();
    if (top != 0) {
      body.animate({
        scrollTop: 100
      }, '500');
    };
  });

  $('#user-name').hide();
  $('nav').on("mouseenter", function(){
    $('#user-name').fadeIn('slow');
  });
  $('nav').on("mouseleave", function(){
    $('#user-name').fadeOut('slow');
  });

  $(window).scroll(function(){
    currentoffset = $(this).scrollTop();
    var navHeight = $("#navbar").height();
    if (currentoffset > 50) {
      // Nav and mic animation
      // // var resultsMargin = $("#results").css('margin-top');
      // $("#navbar").css('height', (navHeight * 0.97));
      $("#navbar").animate({height: '65px'}, 3000);
      $("#search-icon").animate({"margin-top": '-90px'}, 1000);
      $("#navbar").css('background-color', 'rgba(255,255,255,.8)');

      // $("#results").css('margin-top', (resultsMargin *.97));
    } else {
      $("#navbar").animate({height: '80px'}, 3000);
      $("#search-icon").animate({"margin-top": '-70px'}, 1000);
      $("#navbar").css('background-color', 'white');
    }

      // Scroller
    if (currentoffset > 100) {
      $("#scroller").fadeIn();
    } else {
      $('#scroller').fadeOut();
    }
    // if (currentoffset < 150) {
    //   $("#microphone").css('padding',(this.scrollTop * 1.1));
    // }  // $('#logo-text').text().css('left', (currentoffset/200) + 'px');

  });
}
// End Documenet ready

$(document).ready(ready);
$(document).on('page:load', ready);

// Scroll Related Animations



 // thisoffset = currentoffset - 50*(currentoffset/200);
      // scale = (currentoffset*(.001)) +1;
      // $("#navbar").css({top:thisoffset,transform:"scale("+scale+")"});
