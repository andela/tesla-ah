/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryName: DataTypes.STRING,
    articleId: DataTypes.INTEGER
  }, {});

  Category.NewCategory = data => Category.create({ categoryName: data.categoryName });
  Category.EditCategory = (data, id) => Category.update(
    { categoryName: data.categoryName },
    { where: { id } }
  );
  Category.associate = function (models) {
    // associations can be defined here
  };
  return Category;
};
