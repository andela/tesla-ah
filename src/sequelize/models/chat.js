/* eslint-disable func-names */


module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    senderId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    recieverId: DataTypes.INTEGER
  }, {});
  Chat.associate = function (models) {
    // associations can be defined here
    Chat.belongsTo(models.User, {
      as: 'sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Chat;
};
