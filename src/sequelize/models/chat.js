/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    senderId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    recieverId: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN
  }, {});
  Chat.associate = function (models) {
    // associations can be defined here
    Chat.belongsTo(models.User, {
      as: 'sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Chat.belongsTo(models.User, {
      as: 'receiver',
      foreignKey: 'recieverId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Chat;
};
