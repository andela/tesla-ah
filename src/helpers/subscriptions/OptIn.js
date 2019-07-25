import db from '../../sequelize/models';

const { Opt } = db;

const optIn = async ({ userId, type }) => {
  switch (type) {
    case 'email':
      await Opt.create({
        userId,
        type
      });
      break;
    case 'inapp':
      break;
    default:
      break;
  }
  return true;
};

export default optIn;
