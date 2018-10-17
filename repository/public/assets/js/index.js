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
            valueNames: [ 'name', 'address' ],
            item: '<div class="custom-box p-3 hospital-list"><h3 class="name"></h3><p class="address"></p></div>'
          };

          var values = result;

          var userList = new List('users', options, values);
        });

        new jBox('Tooltip', {
          attach: '.tooltip'
        });

      }
    })

  } else if ( $('.container').hasClass('home')) {
    $('#home-menu').addClass('active');
  }


});
