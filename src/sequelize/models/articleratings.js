

module.exports = (sequelize, DataTypes) => {
  const ArticleRatings = sequelize.define('ArticleRatings', {
    slug: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    ratings: DataTypes.INTEGER
  }, {});
  ArticleRatings.associate = () => {};
  return ArticleRatings;
};
