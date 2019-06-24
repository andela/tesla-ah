
module.exports = (sequelize, DataTypes) => {
  const reportedarticles = sequelize.define('ReportedArticles', {
    slug: DataTypes.STRING,
    comment: DataTypes.STRING,
    username: DataTypes.STRING
  }, {});
  reportedarticles.associate = () => {
    // associations can be defined here
  };
  return reportedarticles;
};
