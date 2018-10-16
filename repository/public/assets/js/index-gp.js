$(document).ready(function() {

  function gotoStep2(){
    $('#step2').show(1000);
    $('#step3').hide(500);
    $('#step1').hide(500);
  }

  function gotoStep1(){
    $('#step1').show(1000);
    $('#step3').hide(500);
    $('#step2').hide(500);
  }

  function gotoStep3(){
    $('#step3').show(1000);
    $('#step2').hide(500);
    $('#step1').hide(500);
  }

  if ($('.container').hasClass('referral')){
    $('#referral-menu').addClass('active');
    $('.next-1').click(function() {
      gotoStep2();
    });

    $('.next-2').click(function() {
      gotoStep3();
    });

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar.js", function(){
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title, addEventButton',
          right: 'month',
        },
        defaultDate: '2018-03-12',
        defaultView: 'month',
        minTime:'08:00:00',
        maxTime:'19:00:00',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
        ],
        dayClick: function(date, jsEvent, view) {
          console.log(date);
          console.log(jsEvent);
          console.log(view);
          $.getScript("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js", function(){
            $('#addModal').modal();
            $('#datetimepicker1').datetimepicker({});
            $('#datetimepicker2').datetimepicker({});
           });
         }
      });
    });

    $('#step2').hide();
    $('#step3').hide();

  } else if ( $('.container').hasClass('history')) {
    $('#history-menu').addClass('active');

  } else if ( $('.container').hasClass('profile')) {
    $('#profile-menu').addClass('active');

  }

});
