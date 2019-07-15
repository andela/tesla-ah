module.exports = {
  up: queryInterface => queryInterface.bulkInsert('follows', [{
    userId: 5,
    followerId: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    followerId: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 6,
    followerId: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  ], {}),
};
