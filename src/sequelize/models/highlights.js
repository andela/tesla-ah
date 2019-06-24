export default (sequelize, DataTypes) => {
  const Highlights = sequelize.define('Highlights', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    highlightText: DataTypes.TEXT,
    comment: DataTypes.TEXT,
    occurencyNumber: DataTypes.INTEGER
  }, {});
  Highlights.associate = () => {
    // associations can be defined here
  };
  return Highlights;
};
