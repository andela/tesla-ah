

module.exports = (sequelize, DataTypes) => {
  const Opt = sequelize.define('Opt', {
    userId: DataTypes.INTEGER,
    resource: DataTypes.STRING,
    type: DataTypes.STRING,
    resourceId: DataTypes.INTEGER
  }, {});
  // eslint-disable-next-line no-unused-vars
  Opt.associate = (models) => {
    // associations can be defined here
  };
  return Opt;
};
