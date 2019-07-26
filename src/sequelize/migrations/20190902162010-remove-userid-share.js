module.exports = {
  up: queryInterface => queryInterface.removeColumn('Shares', 'userId'),
  down: queryInterface => queryInterface.addColumn('Shares', 'userId')
};
