module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('follows', 'follows_pkey');
    await queryInterface.addColumn('follows', 'id', { type: Sequelize.INTEGER, autoIncrement: true });
    return queryInterface.sequelize.query('ALTER TABLE "public"."follows" ADD PRIMARY KEY ("id")');
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('follows', 'id');
    return queryInterface.addConstraint('follows', ['userId', 'followerId'], {
      type: 'unique',
      name: 'follows_pkey'
    });
  }
};
