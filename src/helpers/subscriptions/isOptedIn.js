import db from '../../sequelize/models';

const { Opt } = db;

const isOptedIn = async (userId, type) => {
  const inn = await Opt.findOne({
    where: {
      userId,
      type
    }
  });
  return !!inn;
};

export default isOptedIn;
