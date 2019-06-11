

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Opts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    resource: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    resourceId: {
      type: Sequelize.INTEGER
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
  down: queryInterface => queryInterface.dropTable('Opts')
};
