export default (sequelize, DataTypes) => {
  const LikeDislike = sequelize.define(
    'LikeDislike',
    {
      userId: DataTypes.INTEGER,
      articleId: DataTypes.INTEGER,
      likes: DataTypes.INTEGER,
      dislikes: DataTypes.INTEGER,
      commentId: DataTypes.INTEGER
    },
    {}
  );
  return LikeDislike;
};
