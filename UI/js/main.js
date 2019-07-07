/* eslint-disable no-undef */
$(document).scroll(() => {
  if ($(document).scrollTop() > 250) {
    $('header').addClass('shrink');
    $('menu_button').addClass('shrink-menu-button');
  } else {
    $('header').removeClass('shrink');
    $('menu_button').removeClass('shrink-menu-button');
  }
});
