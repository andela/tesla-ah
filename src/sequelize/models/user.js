/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      bio: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      gender: DataTypes.STRING,
      provider: DataTypes.STRING,
      socialId: DataTypes.STRING,
      verified: DataTypes.BOOLEAN,
      roles: DataTypes.ARRAY(DataTypes.STRING),
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Article, {
      as: 'author',
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.Comment, {
      as: 'commentAuthor',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return User;
};
