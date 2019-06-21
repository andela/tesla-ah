module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Comments', // name of Source model
    'articleId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'Articles', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Comments', // name of Source model
    'articleId' // key we want to remove
  )
};
