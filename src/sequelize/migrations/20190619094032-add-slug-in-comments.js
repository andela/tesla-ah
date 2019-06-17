module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'slug', { type: Sequelize.STRING }),
  down: queryInterface => queryInterface.removeColumn('Comments', 'slug')
};
