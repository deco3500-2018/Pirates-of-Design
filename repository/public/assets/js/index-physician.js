
$(document).ready(function() {

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

  }


});
