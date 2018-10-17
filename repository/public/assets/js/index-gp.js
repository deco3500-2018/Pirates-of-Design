$(document).ready(function() {

  function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }
  function eraseCookie(name) {
      document.cookie = name+'=; Max-Age=-99999999;';
  }

  $('#logout-menu').click(function(){
    setCookie('token', '');
    setCookie('userId', '');
    window.location = '/';
  });

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

  } else if ( $('.container').hasClass('ref-detail')) {
    console.log(window.location.href);

    $.ajax({
      url: window.location.href+'/backend',
      method: 'GET',
      success: function(response){
        $('.ref-title').text('Referral #'+ response["id"])
      }
    })

  }

});
