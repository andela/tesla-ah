/* eslint-disable no-undef */
$(document).scroll(() => {
  if ($(document).scrollTop() > 250) {
    $('header').addClass('shrink');
  } else {
    $('header').removeClass('shrink');
  }
});
