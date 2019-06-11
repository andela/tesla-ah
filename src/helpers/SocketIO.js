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
  return io;
};

export default SocketIO;
