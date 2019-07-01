export default (sequelize, DataTypes) => {
  const Emails = sequelize.define('Emails', {
    mail: DataTypes.JSON,
    html: DataTypes.TEXT,
    subject: DataTypes.STRING,
    sent: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  return Emails;
};
