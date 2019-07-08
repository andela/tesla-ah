module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Highlights', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    articleId: {
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    highlightText: {
      type: Sequelize.TEXT
    },
    comment: {
      type: Sequelize.TEXT
    },
    occurencyNumber: {
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
  down: queryInterface => queryInterface.dropTable('Highlights')
};
