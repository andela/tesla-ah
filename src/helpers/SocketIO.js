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

  io.of('/chats').on('connection', (socket) => {
    //socket.userName = 'Eric';
   // console.log(socket);
    // Handle chat event
    socket.on('chat', (data) => {
      // console.log(data);
      io.of('/chats').emit('chat', data);
    });
    // Handle typing event
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });
  });
  return io;
};

export default SocketIO;
