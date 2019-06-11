import db from '../sequelize/models';

const { User } = db;

const favouritedBy = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId
    }
  });
  return user ? user.dataValues : {};
};

export default favouritedBy;
