import db from '../../sequelize/models';

const { User } = db;

const findByUsername = async (username) => {
  const user = await User.findOne({
    where: {
      username
    }
  });

  return !!user;
};

export default findByUsername;
