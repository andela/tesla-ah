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

  LikeDislike.associate = (models) => {
    LikeDislike.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return LikeDislike;
};
