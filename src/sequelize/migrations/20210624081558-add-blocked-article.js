export default {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn('Articles', 'blocked', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }),

  down: async queryInterface => queryInterface.removeColumn('Articles', 'blocked')
};
