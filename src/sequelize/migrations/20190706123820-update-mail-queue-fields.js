export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Emails', 'content', 'mail');
    await queryInterface.addColumn('Emails', 'html', Sequelize.TEXT);
    return queryInterface.addColumn('Emails', 'subject', Sequelize.STRING);
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('Emails', 'mail', 'content');
    await queryInterface.removeColumn('Emails', 'html');
    return queryInterface.removeColumn('Emails', 'subject');
  }
};
