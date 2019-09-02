import TokenIndustry from '../Token.helper';
import chathelper from './saveChats';

const { getUnreadMessageCount, updateReadMessages, saveMessage } = chathelper;
export default (app, io) => {
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  io.on('connection', (socket) => {
    socket.emit('welcome', 'Welcome to AH');
    socket.on('new_user', async (token) => {
      try {
        const currentuser = await TokenIndustry.decodeToken(token);
        if (currentuser.username) {
          const unreadCount = await getUnreadMessageCount(currentuser.username);
          if (unreadCount !== 0) {
            socket.emit('message_unread', {
              receiver: currentuser.username,
              unreadCount
            });
          }
        }
      } catch (error) {
        socket.emit('no_auth', {
          message: 'You are not authenticated'
        });
      }
    });
  });

  const chats = io.of('/chats');
  chats.on('connection', (socket) => {
    socket.on('new_user', async (token) => {
      try {
        const currentUser = await TokenIndustry.decodeToken(token);
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
};
