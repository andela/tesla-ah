export default (sequelize, DataTypes) => {
  const Blacklist = sequelize.define('Blacklist', {
    userId: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    expiresAt: DataTypes.BIGINT,
  }, {});
  Blacklist.associate = () => {
    // associations can be defined here
  };
  return Blacklist;
};
