$(document).ready(function() {

  if ($('.container').hasClass('login')){
    $('#login-menu').addClass('active');

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
          console.log(result);
        }
      });

    })



  } else if ( $('.container').hasClass('home')) {
    $('#home-menu').addClass('active');
  }


});
