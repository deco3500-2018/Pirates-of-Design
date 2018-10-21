
$(document).ready(function() {
  // base_url = 'http://localhost:3000/';
  base_url = 'https://easyreferral.herokuapp.com/';

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

  eraseCookie('userId');
  $.ajax({
    url: base_url + 'users/getphysicians',
    method: 'GET',
    success: function(result){
      setCookie('userId', result[0]['_id']);

      $.getScript("/assets/third-party/Notice/jBox.Notice.js", function(){
        setTimeout(function(){
          new jBox('Notice', {
            theme: 'NoticeFancy',
            attributes: {
              x: 'left',
              y: 'bottom'
            },
            color: 'black',
            content: 'You are assigned as Physician '+ result[0]['name'],
            animation: {open: 'slide:bottom', close: 'slide:left'}
          });
        }, 500)

      });

    }
  })

  $('#logout-menu').click(function(){
    setCookie('token', '');
    setCookie('userId', '');
    window.location = '/';
  });

  if ($('.container').hasClass('schedules')){
    $('#schedules-menu').addClass('active');

    $.getScript("/assets/third-party/fullcalendar.js", function(){
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title, addEventButton',
          right: 'month, agendaWeek, agendaDay',
        },
        defaultDate: new Date(),
        defaultView: 'agendaWeek',
        minTime:'08:00:00',
        maxTime:'19:00:00',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        eventSources: [
            {
                events: function(start, end, timezone, callback) {
                    $.ajax({
                        url: base_url + 'schedules/schedulelist',
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
                            events[i]["title"] = events[i]["name"];
                            i++;
                          });
                          callback(events);

                        }
                    });
                }
            },
        ],
        dayClick: function(date, jsEvent, view) {
          $.getScript("/assets/third-party/bootstrap.min.js", function(){
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
        url: base_url + 'schedules/addschedule',
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


  } else if ( $('.container').hasClass('referral')) {
    $('#referral-menu').addClass('active');

    $.ajax({
      url: base_url + 'referral/referwait',
      method: 'GET',
      success: function(result){

        for (i=0; i<3; i++){
          if (result[i]){
            $('.waiting-approval').append(
              '<div class="custom-box p-3 each_referral_wait mt-2">' +
              '<p class="hidden hid_id">'+result[i]['_id']+'</p>'+
                '<p class="box_title text-bold">' + result[i]["patient_name"]+'</p>' +
                '<p class="box_date font-80">Thu, 16/16/2018 09:00 - 11:00</p>' +
                '<br/>' +
                '<p class="ref_title font-80 text-bold">'+ result[i]["category"]+'</p>' +
                '<p class="ref_title font-80 text-bold">'+ result[i]["name"]+'</p>' +
                '<p class="ref_description font-80">'+ result[i]["description"]+'</p>' +

              '</div>'
            )
          }
        }

        $('.each_referral_wait').click(function(){
          id = $(this).children('.hid_id').text();
          window.location = '/physician/referral-wait/'+id;
        });

      }
    });

    $.ajax({
      url: base_url + 'referral/referapproved',
      method: 'GET',
      success: function(result){

        for (i=0; i<3; i++){
          if (result[i]){
            $('.latest-appointment').append(
              '<div class="custom-box p-3 each_referral mt-2">' +
                '<p class="hidden hid_id">'+result[i]['_id']+'</p>'+
                '<p class="box_title text-bold">' + result[i]["patient_name"]+'</p>' +
                '<p class="box_date font-80">Thu, 16/16/2018 09:00 - 11:00</p>' +
                '<br/>' +
                '<p class="ref_title font-80 text-bold">'+ result[i]["category"]+'</p>' +
                '<p class="ref_title font-80 text-bold">'+ result[i]["name"]+'</p>' +
                '<p class="ref_description font-80">'+ result[i]["description"]+'</p>' +

              '</div>'
            )
          }
        }

        $('.each_referral').click(function(){
          id = $(this).children('.hid_id').text();
          window.location = '/physician/referral/'+id;
        });

      }
    });

    $('.all-appointment').click(function(){
      window.location = '/physician/all-referral';
    });



  } else if ( $('.container').hasClass('profile')) {
    $('#profile-menu').addClass('active');

    $.ajax({
      url: base_url + 'users/profile',
      type: 'POST',
      dataType: 'json',
      data: {
        'id': getCookie('userId')
      },
      success: function(result){
        $('.name').text(result[0]["name"]);

        $('.email').text('Email: ' +result[0]["email"]);
        $('.phonum').text('Phone number: '+result[0]["phonum"]);
        $('.experience').text('Experience: ' + result[0]["experience"] + ' years');
        $('.estimate_cost').text('Estimate cost: $'+result[0]["estimate_cost"]);

        $('.medical_id').text('Medical ID: ' +result[0]["medicalnum"]);

        $.ajax({
          url: base_url + 'hospital/hospitalinfo',
          method: 'POST',
          dataType: 'json',
          data: {
            'id': result[0]['hospitalId']
          },
          success: function(hospitalresult){
            $('.hos_name').text('Name: ' + hospitalresult[0]['name']);
            $('.hos_address').text('Address: ' + hospitalresult[0]['address']);
          }
        });
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

        $('.patient_name').text('Name: ' + response[0]['patient_name']);
        $('.patient_address').text('Address: ' + response[0]['patient_address']);
        $('.patient_phonum').text('Phone Number: ' + response[0]['patient_phonum']);

        $('.category').text('Category: ' + response[0]['category']);
        $('.name').text(response[0]['name']);
        $('.description').text(response[0]['description']);

        $.ajax({
          url: base_url + 'users/profile',
          method: 'POST',
          dataType: 'json',
          data: {
            'id': response[0]['gp_id']
          },
          success: function(gpresult){
            $('.gp_name').text('Name: ' + gpresult[0]['name']);
            $('.gp_phonum').text('Phone Number: ' + gpresult[0]['phonum']);
          }
        });

        $.ajax({
          url: base_url + 'users/profile',
          method: 'POST',
          dataType: 'json',
          data: {
            'id': response[0]['physician_id']
          },
          success: function(physicianresult){
            $('.physician_name').text('Name: ' + physicianresult[0]['name']);
            $('.physician_phonum').text('Phone Number: ' + physicianresult[0]['phonum']);

            $.ajax({
              url: base_url + 'hospital/hospitalinfo',
              method: 'POST',
              dataType: 'json',
              data: {
                'id': physicianresult[0]['hospitalId']
              },
              success: function(hospitalresult){
                $('.hos_name').text(hospitalresult[0]['name']);
                $('.hos_address').text(hospitalresult[0]['address']);

              }
            })
          }
        });

        $('.gp_id').text('GP ID number: ' + response[0]['gp_id']);
        $('.physician_id').text('Physician ID number: ' + response[0]['physician_id']);

        $('.chat-link').attr('href', base_url + 'chat/' + response[0]['_id']);

      }
    })

  } else if ( $('.container').hasClass('ref-wait')) {
    console.log(window.location.href);

    $.ajax({
      url: window.location.href+'/backend',
      method: 'GET',
      success: function(response){
        console.log(response);
        $('.ref-title').text('Referral #'+ response[0]["_id"])

        $('.patient_name').text('Name: ' + response[0]['patient_name']);
        $('.patient_address').text('Address: ' + response[0]['patient_address']);
        $('.patient_phonum').text('Phone Number: ' + response[0]['patient_phonum']);

        $('.name').text(response[0]['name']);
        $('.description').text(response[0]['description']);
        $('.category').text('Category: ' + response[0]['category']);


        $.ajax({
          url: base_url + 'users/profile',
          method: 'POST',
          dataType: 'json',
          data: {
            'id': response[0]['gp_id']
          },
          success: function(gpresult){
            $('.gp_name').text('Name: ' + gpresult[0]['name']);
            $('.gp_phonum').text('Phone Number: ' + gpresult[0]['phonum']);
          }
        });

        $.ajax({
          url: base_url + 'users/profile',
          method: 'POST',
          dataType: 'json',
          data: {
            'id': response[0]['physician_id']
          },
          success: function(physicianresult){
            $('.physician_name').text('Name: ' + physicianresult[0]['name']);
            $('.physician_phonum').text('Phone Number: ' + physicianresult[0]['phonum']);

            $.ajax({
              url: base_url + 'hospital/hospitalinfo',
              method: 'POST',
              dataType: 'json',
              data: {
                'id': physicianresult[0]['hospitalId']
              },
              success: function(hospitalresult){
                $('.hos_name').text(hospitalresult[0]['name']);
                $('.hos_address').text(hospitalresult[0]['address']);

              }
            })
          }
        });

        $('.gp_id').text('GP ID number: ' + response[0]['gp_id']);
        $('.physician_id').text('Physician ID number: ' + response[0]['physician_id']);

        $('.chat-link').attr('href', base_url + 'chat/' + response[0]['_id']);

      }
    });

    $('.ref-approve').click(function(){

      $.getScript('/assets/third-party/jquery-confirm.min.js', function(){
        $.confirm({
          title: 'Confirm!',
          content: 'Last confirmation for the referral?',
          buttons: {
              confirm: function () {
                $.ajax({
                  url: base_url + 'referral/updateReferral',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    "_id": $('.hid_ref_id').text(),
                    "state": 2,
                    "name": $('.name').text(),
                    "patient_name": $('.patient_name').text(),
                    "patient_address": $('.patient_address').text(),
                    "patient_phonum": $('.patient_phonum').text(),
                    "patient_dob": $('.patient_dob').text(),
                    "description": $('.description').text(),
                    "gp_id": $('.gp_id').text(),
                    "physician_id": $('.physician_id').text(),
                    "category": $('.category').text()
                  },
                  success: function(result){
                    console.log(result);
                    window.location = '/physician/referral/' + result["data"]["_id"];
                  }
                })
              },
              cancel: function () {
                // cancel
              }
            }
        });
      });

    });

    $('.ref-cancel').click(function(){

      $.getScript('/assets/third-party/jquery-confirm.min.js', function(){
        $.confirm({
          title: 'Confirm',
          content: 'Are you sure you want to cancel?',
          buttons: {
              confirm: function () {

                $.ajax({
                  url: base_url + 'referral/updateReferral',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    "_id": $('.hid_ref_id').text(),
                    "state": 0,
                    "name": $('.name').text(),
                    "patient_name": $('.patient_name').text(),
                    "patient_address": $('.patient_address').text(),
                    "patient_phonum": $('.patient_phonum').text(),
                    "patient_dob": $('.patient_dob').text(),
                    "description": $('.description').text(),
                    "gp_id": $('.gp_id').text(),
                    "physician_id": $('.physician_id').text(),
                    "category": $('.category').text()
                  },
                  success: function(result){
                    window.location = '/physician/referral/' + result["data"]["_id"];
                  }
                })
              },
              cancel: function () {
                // cancel
              }
            }
        });
      });

    });



  } else if ( $('.container').hasClass('all-history')) {
    console.log('all-history');

    $.ajax({
      url: base_url + 'referral/referrallist',
      type: 'GET',
      dataType: 'json',
      success: function(result){
        console.log(result);
        $.getScript("/assets/third-party/list.min.js", function(){
          var options = {
            valueNames: [ '_id', 'name', 'patient_name' ],
            item: '<div class="my-2 referral-list"><p class="hidden _id"></p><h3 class="name"></h3>Patient name: <p class="patient_name"></p><br/>Thu, 16 Oct 2018<hr/></div>'
          };

          var values = result;
          var userList = new List('referrals', options, values);

          $('.referral-list').click(function(){
            id = $(this).children('.hidden._id').text();
            window.location = '/physician/referral/'+id;
          });
        });

      }
    });
  }


});
