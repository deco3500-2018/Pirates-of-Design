
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

  if ($('.container').hasClass('schedules')){
    $('#schedules-menu').addClass('active');

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar.js", function(){
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title, addEventButton',
          right: 'month, agendaWeek, agendaDay',
        },
        defaultDate: '2018-03-12',
        defaultView: 'agendaWeek',
        minTime:'08:00:00',
        maxTime:'19:00:00',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
          {
            title: 'Meeting',
            start: '2018-03-12T10:30:00',
            end: '2018-03-12T12:30:00'
          }
        ],
        dayClick: function(date, jsEvent, view) {
          $.getScript("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js", function(){
            $('#addModal').modal();
            $('#datetimepicker1').datetimepicker({});
            $('#datetimepicker2').datetimepicker({});
           });
         }
      });
    });

    $('#addEventBtn').click(function() {
      console.log($('#name').val());
      $('#addModal').modal('hide');
    })


  } else if ( $('.container').hasClass('referral')) {
    $('#referral-menu').addClass('active');

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

  } else if ( $('.container').hasClass('all-history')) {
    console.log('all-history');

    $.ajax({
      url: 'http://localhost:3000/referral/referrallist',
      type: 'GET',
      dataType: 'json',
      success: function(result){
        console.log(result);
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js", function(){
          var options = {
            valueNames: [ '_id', 'name', 'patient_name' ],
            item: '<div class="my-2 referral-list"><p class="hidden _id"></p><h3 class="name"></h3>Patient name: <p class="patient_name"></p><br/>Thu, 16 Oct 2018<hr/></div>'
          };

          var values = result;
          var userList = new List('referrals', options, values);

          // $('.hospital-list').click(function() {
          //   $('.chosen-hospital').html($(this).html());
          // });
        });

      }
    });
  }


});
