export default (sequelize, DataTypes) => {
  const Share = sequelize.define('Share', {
    slug: DataTypes.STRING,
    provider: DataTypes.STRING
  }, {});
  return Share;
};
