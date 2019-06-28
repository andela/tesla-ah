export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Blacklists', 'expiresAt', {
    type: Sequelize.BIGINT,
    allowNull: false
  }),

  down: queryInterface => queryInterface.removeColumn('Blacklists', 'expiresAt')
};
