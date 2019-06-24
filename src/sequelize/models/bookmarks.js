
module.exports = (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define('Bookmarks', {
    slug: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Bookmarks.associate = () => {
    // associations can be defined here
  };
  return Bookmarks;
};
