import http from 'http';
import dotenv from 'dotenv';
import socketIO from 'socket.io';
import eventEmitter from './notifications/EventEmitter';
import Tokenizer from './Token.helper';
import chatHelper from './chat/saveChats';

const { saveMessage, updateReadMessages, getUnreadMessageCount } = chatHelper;

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
    socket.on('user_back', async (token) => {
      try {
        const currentUser = await Tokenizer.decodeToken(token);
        if (currentUser.username) {
          const unreadCount = await getUnreadMessageCount(currentUser.username);
          if (unreadCount !== 0) {
            socket.emit('message_unread', {
              receiver: currentUser.username,
              unreadCount
            });
          }
        }
      } catch (error) {
        io.emit('no_auth', {
          message: 'You are not authenticated'
        });
      }
    });
  });

  const chats = io.of('/chats');
  chats.on('connection', (socket) => {
    socket.on('new_user', async (token) => {
      try {
        const currentUser = await Tokenizer.decodeToken(token);
        const count = await getUnreadMessageCount(currentUser.username);
        if (count !== 0) {
          await updateReadMessages(currentUser.username);
        }
        if (currentUser.username) {
          socket.on('chat', async ({ sender, receiver, message }) => {
            const { id } = await saveMessage({
              sender, receiver, message, read: false
            });
            chats.emit('chat', {
              id, sender, message, receiver
            });
            const unreadCount = await getUnreadMessageCount(currentUser.username);
            if (unreadCount !== 0) {
              io.sockets.emit('message_unread', {
                receiver: currentUser.username,
                unreadCount
              });
            }
          });
          socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
          });
        }
      } catch (error) {
        chats.emit('no_auth', {
          message: 'You are not authenticated'
        });
      }
    });
  });
  return io;
};

export default SocketIO;
