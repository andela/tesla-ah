/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const follows = sequelize.define(
    'follows',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {}
  );
  follows.associate = function (models) {
    // associations can be defined here
    follows.belongsTo(models.User, {
      foreignKey: 'userId',
      targetedKey: 'id',
      as: 'followedUser',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    follows.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'follower',
      targetedKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return follows;
};
