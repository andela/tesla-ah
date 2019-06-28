module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BlockedArticles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    reporterId: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    articleId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    authorId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    moderatorId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    blockedDay: {
      allowNull: false,
      type: Sequelize.STRING
    },
    description: {
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('ReportedArticles')
};
