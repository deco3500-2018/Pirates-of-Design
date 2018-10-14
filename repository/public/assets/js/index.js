$(window).on('load', function() {

  if ($('.container').hasClass('login')){
    $('#login-menu').addClass('active');

  } else if ( $('.container').hasClass('register')) {
    $('#signup-menu').addClass('active');

    $.ajax({
      url: 'http://localhost:3000/users/usersList',
      type: 'GET',
      dataType: 'json',
      success: function(result){
        console.log(result);

        var options = {
          valueNames: [ 'name', 'born' ],
          item: '<li><h3 class="name"></h3><p class="born"></p></li>'
        };

        var values = [{
          name: "Martina Elm",
          born: 1986
          }, {
          name: "Martina Elm 2",
          born: 1986
          },
        ];

        var userList = new List('users', options, values);

        new jBox('Tooltip', {
          attach: '.tooltip'
        });

      }
    })

  } else if ( $('.container').hasClass('home')) {
    $('#home-menu').addClass('active');
  }


});
