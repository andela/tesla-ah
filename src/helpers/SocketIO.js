import http from 'http';
import dotenv from 'dotenv';
import socketIO from 'socket.io';
import eventEmitter from './notifications/EventEmitter';

dotenv.config();

const SocketIO = (app) => {
  http.createServer(app);
  const port = process.env.SOCKET_PORT;
  const io = socketIO.listen(app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Socket.IO is running on port ${port}`);
  }));
  io.use((socket, next) => {
    next(null, next);
  });
  io.on('connection', (socket) => {
    eventEmitter.on('new_inapp', (message, user) => {
      socket.emit('new_message', {
        message,
        user
      });
    });
  });

  const chats = io.of('/chats');
  const users = {};
  chats.on('connection', (socket) => {
    socket.on('new_user', ({ username, userToChat }) => {
      socket.username = username;
      if (userToChat in users) {
        // eslint-disable-next-line no-console
        console.log('Online');
      } else {
        socket.userToChat = userToChat;
        users[socket.userToChat] = socket;
      }
    });
    socket.on('chat', ({ sender, receiver, message }) => {
      // console.log(`Sender:${users[sender]}`);
      // console.log(`Receiver:${users[receiver]}`);
      if (receiver in users) {
        chats.emit('chat', { sender, message, receiver });
        // users[receiver].emit('chat', {
        //   sender,
        //   receiver,
        //   message
        // });
      }
      // socket.to(users[receiver].id).emit('chat', {
      //   sender,
      //   receiver,
      //   message
      // });
      // console.log('Socket ID', socket.id);
      // chats.to(socket.id).emit('chat', {
      //   sender,
      //   message
      // });
    });
    // Handle typing event
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });
  });
  return io;
};

export default SocketIO;
