/* eslint-disable no-console */
/* eslint-disable no-undef */
$(document).ready(() => {
  const socket = io('http://localhost:5000');
  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

  socket.on('new_message', ({ message, user }) => {
    $('.publish-info').html(message);
    console.log(`Current User: ${user}`);
  });
});
