/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    bio: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  users.associate = function (models) {
    // associations can be defined here
    users.hasMany(models.article, {
      as: 'author',
      foreignKey: 'authorid',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return users;
};
