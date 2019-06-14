/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.TEXT,
    image: DataTypes.TEXT,
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.STRING,
    provider: DataTypes.STRING,
    socialId: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  }, {});

  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.article, {
      as: 'author',
      foreignKey: 'authorid',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return User;
};
