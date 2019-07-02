

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.STRING
    },
    dateOfBirth: {
      type: Sequelize.DATE
    },
    gender: {
      type: Sequelize.STRING
    },
    provider: {
      type: Sequelize.STRING
    },
    socialId: {
      type: Sequelize.STRING
    },
    verified: {
      type: Sequelize.BOOLEAN
    },
    isAdmin: {
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
