

module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define('Blacklist', {
    userId: DataTypes.INTEGER,
    token: DataTypes.TEXT
  }, {});
  Blacklist.associate = () => {
    // associations can be defined here
  };
  return Blacklist;
};
