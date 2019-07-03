module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Articles', 'views', {
    type: Sequelize.INTEGER
  }),

  down: queryInterface => queryInterface.removeColumn('Articles', 'views')
};
