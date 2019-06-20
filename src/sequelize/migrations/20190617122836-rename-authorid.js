export default {
  up: queryInterface => queryInterface.renameColumn('Articles', 'authorid', 'authorId'),

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
