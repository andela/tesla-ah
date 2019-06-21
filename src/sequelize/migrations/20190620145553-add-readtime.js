

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Articles', 'readtime', Sequelize.STRING, {
    after: 'title'
  }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Articles', 'readtime')
};
