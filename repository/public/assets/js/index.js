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

  if ($('.container').hasClass('login')){
    $('#login-menu').addClass('active');

    $('.login-button').click(function(){
      email = $('#inputEmail').val();
      password = $('#inputPassword').val();

      console.log('masuk');

      $.ajax({
        url: 'http://localhost:3000/users/authenticate',
        type: 'POST',
        dataType: 'json',
        data: {
          "email": email,
          "password": password
        },
        success: function(result){

          eraseCookie('token');
          eraseCookie('userId');
          setCookie('userId',result.user._id,10);
          setCookie('token',result.token,10);
          x = getCookie('token');

          if (result.user.isPhysician){
            window.location = '/physician/schedule';
          } else {
            window.location = '/gp/referral'
          }
        }
      });
    })

  } else if ( $('.container').hasClass('register')) {
    $('#signup-menu').addClass('active');

    $.ajax({
      url: 'http://localhost:3000/hospital/hospitallist',
      type: 'GET',
      dataType: 'json',
      success: function(result){
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js", function(){
          var options = {
            valueNames: [ '_id', 'name', 'address' ],
            item: '<div class="custom-box p-3 hospital-list"><p class="hidden _id"></p><h3 class="name"></h3><p class="address"></p></div>'
          };

          var values = result;
          var userList = new List('hospitals', options, values);

          $('.hospital-list').click(function() {
            $('.chosen-hospital').html($(this).html());
          });
        });

      }
    });

    $('.register-button').click(function(){

      console.log('masuk');

      name = $('#inputName').val();
      email = $('#inputEmail').val();
      password = $('#inputPassword').val();
      medicalnum = $('#inputMedicalId').val();
      experience = $('#inputExperience').val();
      estimate_cost = $('#inputCost').val();
      phonum = $('#inputPhonum').val();
      isPhysician = $('#isPhysician').is(':checked');
      hospitalId = $('.chosen-hospital .hidden._id').text();

      $.ajax({
        url: 'http://localhost:3000/users/register',
        type: 'POST',
        dataType: 'json',
        data: {
          "name": name,
          "email": email,
          "password": password,
          "medicalnum": medicalnum,
          "experience": experience,
          "estimate_cost": estimate_cost,
          "phonum": phonum,
          "isPhysician": isPhysician,
          "hospitalId": hospitalId
        },
        success: function(result){
          $.getScript("/assets/third-party/notice/jbox.notice.js", function(){
            console.log('masjk2');
            setTimeout(function(){
              new jBox('Notice', {
                theme: 'NoticeFancy',
                attributes: {
                  x: 'left',
                  y: 'bottom'
                },
                color: 'black',
                content: 'Thank you for registering!<br/>Continue to log in',
                animation: {open: 'slide:bottom', close: 'slide:left'}
              });
            }, 500)

          });
        }
      });

    })



  } else if ( $('.container').hasClass('home')) {
    $('#home-menu').addClass('active');
  }


});
