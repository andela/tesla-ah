module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Chats', [{
    senderId: 10,
    recieverId: 5,
    message: 'hello tyhere',
    read: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    senderId: 5,
    recieverId: 10,
    message: 'How are you?',
    read: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    senderId: 10,
    recieverId: 5,
    message: 'Im fine',
    read: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  ], {}),
};
