module.exports = {
  up: queryInterface => queryInterface.addConstraint('follows', ['userId', 'followerId'], {
    type: 'unique',
    name: 'follows_userId_followerId_idx'
  }),

  down: queryInterface => queryInterface.removeConstraint('follows', 'follows_userId_followerId_idx'),
};
