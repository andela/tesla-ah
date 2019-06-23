module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('LikeDislikes', 'commentId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'Comments',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }),

  down: queryInterface => queryInterface.removeColumn('LikeDislikes', 'commentId')
};
