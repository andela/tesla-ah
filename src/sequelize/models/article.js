/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const article = sequelize.define(
    'article',
    {
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      tagList: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      authorid: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  article.associate = function (models) {
    // associations can be defined here
    article.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'authorid',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return article;
};
