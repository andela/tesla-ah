export default (sequelize, DataTypes) => {
  const Share = sequelize.define('Share', {
    userId: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    provider: DataTypes.STRING
  }, {});
  return Share;
};
