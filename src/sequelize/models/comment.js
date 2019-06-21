module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      comment: DataTypes.STRING,
      slug: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      articleId: DataTypes.INTEGER,
      commentId: DataTypes.INTEGER
    },
    {}
  );
  // eslint-disable-next-line func-names
  Comment.associate = function (models) {
    Comment.hasMany(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Comment.belongsTo(models.User, {
      as: 'commentAuthor',
      foreignKey: 'userId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Article, {
      as: 'Article',
      foreignKey: 'articleId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
