
module.exports = (sequelize, DataTypes) => {
  const blockedArticles = sequelize.define('BlockedArticles', {
    reporterId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    moderatorId: DataTypes.INTEGER,
    blockedDay: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  blockedArticles.associate = () => {
    // associations can be defined here
  };
  return blockedArticles;
};
