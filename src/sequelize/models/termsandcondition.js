export default (sequelize, DataTypes) => {
  const termsAndCondition = sequelize.define('termsAndCondition', {
    termsAndConditions: DataTypes.TEXT
  }, {});
  return termsAndCondition;
};
