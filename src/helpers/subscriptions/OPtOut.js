import db from '../../sequelize/models';

const { Opt } = db;

const optOut = async ({ userId, type }) => {
  switch (type) {
    case 'email':
      await Opt.destroy({
        where: {
          userId,
          type
        }
      });
      break;
    case 'inapp':
      await Opt.destroy({
        where: {
          userId,
          type
        }
      });
      break;
    default:
      break;
  }
  return true;
};

export default optOut;
