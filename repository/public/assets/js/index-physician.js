$(window).on('load', function() {

  if ($('.container').hasClass('schedules')){
    $('#schedules-menu').addClass('active');

  } else if ( $('.container').hasClass('referral')) {
    $('#referral-menu').addClass('active');

  } else if ( $('.container').hasClass('profile')) {
    $('#profile-menu').addClass('active');
  }

});
