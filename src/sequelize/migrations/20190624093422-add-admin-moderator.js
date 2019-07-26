export default {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.removeColumn('Users', 'isAdmin');
    // return queryInterface.addColumn('Users', 'roles', {
    //   type: Sequelize.ARRAY(Sequelize.STRING),
    //   defaultValue: ['user'],
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'roles');
    return queryInterface.addColumn('Users', 'isAdmin', { type: Sequelize.STRING });
  }
};
