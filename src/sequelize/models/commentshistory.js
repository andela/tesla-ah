module.exports = (sequelize, DataTypes) => {
  const CommentsHistory = sequelize.define('CommentsHistory', {
    userId: DataTypes.INTEGER,
    editedComment: DataTypes.STRING,
    commentId: DataTypes.INTEGER
  }, {});
  return CommentsHistory;
};
