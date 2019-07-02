

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    resource: DataTypes.STRING,
    resourceId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    url: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  // eslint-disable-next-line func-names
  // eslint-disable-next-line no-unused-vars
  Notification.associate = (models) => {
    // associations can be defined here
  };
  return Notification;
};
