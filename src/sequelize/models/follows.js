/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const follows = sequelize.define(
    'follows',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        followerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'Users',
            key: 'id'
          }
        }
      }
    },
    {}
  );
  follows.associate = function (models) {
    // associations can be defined here
    follows.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'followedUser'
    });
    follows.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'follower'
    });
  };
  return follows;
};
