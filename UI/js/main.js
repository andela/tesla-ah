/* eslint-disable no-undef */
$(document).scroll(() => {
  if ($(document).scrollTop() > 250) {
    $('#home_header').addClass('shrink');
  } else {
    $('#home_header').removeClass('shrink');
  }
});
