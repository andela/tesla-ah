export default {
  up: queryInterface => queryInterface.renameTable('articles', 'Articles'),

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
