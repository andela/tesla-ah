import db from '../../sequelize/models';

const { User } = db;

const findByEmail = async (email) => {
  const user = await User.findOne({
    where: {
      email
    }
  });
  return !!user;
};

export default findByEmail;
