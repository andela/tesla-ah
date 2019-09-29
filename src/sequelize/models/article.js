/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      slug: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      readtime: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      tagList: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      gallery: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      views: {
        type: DataTypes.INTEGER
      },
    },
    {}
  );
  Article.getMyOwnArticles = authorId => Article.findAll({ where: { authorId } });
  Article.associate = function (models) {
    // associations can be defined here
    Article.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'authorId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Article.hasMany(models.LikeDislike, {
      as: 'metrics',
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Article;
};
