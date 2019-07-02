

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER
    },
    resource: {
      type: Sequelize.STRING
    },
    resourceId: {
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
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
  down: queryInterface => queryInterface.dropTable('Notifications')
};
