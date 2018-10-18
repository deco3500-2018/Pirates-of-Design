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

  if (getCookie('userId') == null){
    $.ajax({
      url: 'http://localhost:3000/users/getgp',
      method: 'GET',
      success: function(result){
        setCookie('userId', result[0]['_id']);

        $.getScript("/assets/third-party/notice/jbox.notice.js", function(){
          setTimeout(function(){
            new jBox('Notice', {
              theme: 'NoticeFancy',
              attributes: {
                x: 'left',
                y: 'bottom'
              },
              color: 'black',
              content: 'You are assigned as GP '+ result[0]['name'],
              animation: {open: 'slide:bottom', close: 'slide:left'}
            });
          }, 500)

        });

      }
    })
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
      $.getScript("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js", function(){
        $('#addModal').modal();
        $('#datetimepicker1').datetimepicker({});
        $('#datetimepicker2').datetimepicker({});
       });

       // gotoStep2();
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
        defaultDate: new Date(),
        defaultView: 'month',
        minTime:'08:00:00',
        maxTime:'19:00:00',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        eventSources: [
            {
                events: function(start, end, timezone, callback) {
                    $.ajax({
                        url: 'http://localhost:3000/schedules/schedulelist',
                        dataType: 'json',
                        method: 'GET',
                        success: function(msg) {
                          var i = 0;
                          var events = msg;
                          $.each(events,function() {
                            start = moment(events[i]["start_date"]);
                            end = moment(events[i]["end_date"]);
                            events[i]["start"] = start;
                            events[i]["end"] = end;
                            i++;
                          });
                          callback(events);

                        }
                    });
                }
            },
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

    $('#addEventBtn').click(function(){
      name = $('#name').val();
      description = $('#description').val();
      start_date = $('#start_date').val();
      end_date = $('#end_date').val();

      start_moment = moment(start_date, 'MM/DD/YYYY h:mm A');
      end_moment = moment(end_date, 'MM/DD/YYYY h:mm A');

      $.ajax({
        url: 'http://localhost:3000/schedules/addschedule',
        method: 'POST',
        type: 'json',
        data: {
          name: name,
          description: description,
          start_date: start_moment.format(),
          end_date: end_moment.format()
        },
        success: function(result){
          console.log(result);
          $('#addModal').modal('hide');
          gotoStep2();
        }
      })

    })

    $.ajax({
      url: 'http://localhost:3000/users/getphysicians',
      method: 'GET',
      success: function(result){
        $.each(result, function(test){
          $('.physician-list').append(
            '<div class="custom-box p-3 mt-2 each_physician">' +
            '<p class="box_title text-bold">' + result[test]["name"] +'</p>' +
            '<p class="box_date font-80"> Experience: ' +result[test]["experience"]+' years, Estimate Cost: $' +result[test]["estimate_cost"] + '</p>'+
            '<br/>' +
            '<p class="ref_title font-80 text-bold">Hospital: Hospital A</p>' +
            '<p class="ref_description font-80">Phone Number: '+result[test]["phonum"]+' </p>' +
          '</div>'
          )
        });

        $('.each_physician').click(function(){
          $('.physician-detail').html(
            '<img class="pic" src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?size=338&ext=jpg">'+
            '<p class="font-mo text-bold">Luke <br/>Clarkson</p>'+
            '<hr class="custom-hr" align="left" />'+
            '<p class="font-80">123123 Street Road</p>'+
            '<p class="font-80">040212341234</p>'+
            '<p class="font-80">21 years old (1990-02-02)</p>'+
            '<p class="font-80">Medical ID: 123123</p>'+
            '<br/>'+
            '<p class="font-80">Hospital A</p>'+
            '<p class="font-80">asdfadsfasdf St</p>'+
            '<p class="font-80"></p>'
          );
        });

      }
    })

    $('.next-3').click(function(){
      $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js', function(){
        $.confirm({
          title: 'Confirm!',
          content: 'Simple confirm!',
          buttons: {
              confirm: function () {
                gotoStep1();

                $.getScript("/assets/third-party/notice/jbox.notice.js", function(){
                  setTimeout(function(){
                    new jBox('Notice', {
                      theme: 'NoticeFancy',
                      attributes: {
                        x: 'left',
                        y: 'bottom'
                      },
                      color: 'black',
                      content: 'The referral is successfully registered',
                      animation: {open: 'slide:bottom', close: 'slide:left'}
                    });
                  }, 500)

                });
              },
              cancel: function () {
                // cancel
              }
            }
        });
      });

    });

    $('#step2').hide();
    $('#step3').hide();

  } else if ( $('.container').hasClass('history')) {
    $('#history-menu').addClass('active');

    $.ajax({
      url: 'http://localhost:3000/referral/referrallist',
      method: 'GET',
      success: function(result){
        console.log(result);

        for (i=0; i<3; i++){
          if (result[i]){
            $('.latest-referral').append(
              '<div class="custom-box p-3 each_referral mt-2">' +
                '<p class="hidden hid_id">'+result[i]['_id']+'</p>'+
                '<p class="box_title text-bold">' + result[i]["patient_name"]+'</p>' +
                '<p class="box_date font-80">Thu, 16/16/2018 09:00 - 11:00</p>' +
                '<br/>' +
                '<p class="ref_title font-80 text-bold">'+ result[i]["name"]+'</p>' +
                '<p class="ref_description font-80">'+ result[i]["description"]+'</p>' +

              '</div>'
            )
          }
        }

        $('.each_referral').click(function(){
          id = $(this).children('.hid_id').text();
          window.location = '/gp/referral/'+id;
        });

      }
    });

    $('.all-appointment').click(function(){
      window.location = '/gp/history-all';
    })

  } else if ( $('.container').hasClass('profile')) {
    $('#profile-menu').addClass('active');

    $.ajax({
      url: 'http://localhost:3000/users/profile',
      type: 'POST',
      dataType: 'json',
      data: {
        'id': getCookie('userId')
      },
      success: function(result){
        $('.name').text(result[0]["name"]);

        $('.email').text(result[0]["email"]);
        $('.phonum').text('Phone number: '+result[0]["phonum"]);
        $('.experience').text('Experience: ' + result[0]["experience"] + ' years');
        $('.estimate_cost').text('Estimate cost: $'+result[0]["estimate_cost"]);

        $('.medical_id').text(result[0]["medicalnum"]);
      }
    });

  } else if ( $('.container').hasClass('ref-detail')) {
    console.log(window.location.href);

    $.ajax({
      url: window.location.href+'/backend',
      method: 'GET',
      success: function(response){
        console.log(response);
        $('.ref-title').text('Referral #'+ response[0]["_id"])

        $('.patient_name').text(response[0]['patient_name']);
        $('.patient_address').text(response[0]['patient_address']);
        $('.patient_phonum').text(response[0]['patient_phonum']);

        $('.name').text(response[0]['name']);
        $('.description').text(response[0]['description']);

        $('.gp_id').text(response[0]['gp_id']);
        $('.physician_id').text(response[0]['physician_id']);

        $('.chat-link').attr('href','/chat/' + response[0]['_id']);

      }
    })

  } else if ( $('.container').hasClass('all-history')) {
    console.log('all-history');

    $.ajax({
      url: 'http://localhost:3000/referral/referrallist',
      type: 'GET',
      dataType: 'json',
      success: function(result){
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js", function(){
          var options = {
            valueNames: [ '_id', 'name', 'patient_name' ],
            item: '<div class="my-2 referral-list"><p class="hidden _id"></p><h3 class="name"></h3>Patient name: <p class="patient_name"></p><br/>Thu, 16 Oct 2018<hr/></div>'
          };

          var values = result;
          var userList = new List('referrals', options, values);

          $('.referral-list').click(function(){
            id = $(this).children('.hidden._id').text();
            window.location = '/gp/referral/'+id;
          });
        });

      }
    });
  }

});
