module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'isAdmin', { type: Sequelize.STRING }),

  down: queryInterface => queryInterface.removeColumn('Users', 'isAdmin')
};
