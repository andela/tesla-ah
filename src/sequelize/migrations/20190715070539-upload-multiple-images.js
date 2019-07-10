export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image');
    await queryInterface.removeColumn('Articles', 'image');
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
    });
    return queryInterface.addColumn('Articles', 'gallery', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'avatar');
    await queryInterface.removeColumn('Users', 'cover');
    await queryInterface.removeColumn('Articles', 'gallery');
    await queryInterface.addColumn('Users', 'image');
    await queryInterface.addColumn('Articles', 'image');
  }
};
