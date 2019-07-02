import db from '../sequelize/models';

const { User } = db;

const findUser = async (username) => {
  const { dataValues } = await User.findOne({
    where: {
      username
    }
  });
  return dataValues || {};
};
export default findUser;
