module.exports = (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define(
    'Bookmarks',
    {
      slug: DataTypes.STRING,
      userId: DataTypes.INTEGER
    },
    {}
  );
  Bookmarks.associate = (models) => {
    Bookmarks.belongsTo(models.Article, {
      foreignKey: 'slug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'article'
    });
  };
  return Bookmarks;
};
