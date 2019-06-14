import db from '../sequelize/models';

const { Blacklist } = db;

const dropToken = async (req, res, next) => {
  const { id } = req.user;
  const token = await Blacklist.findAll({
    where: {
      token: req.token
    }
  });
  if (token.length) {
    return res.send({
      message: 'Bad request!!!'
    });
  }

  const user = await Blacklist.findAll({
    where: {
      userId: id
    }
  });
  if (user.length) {
    const deleted = await Blacklist.destroy({
      where: {
        userId: id
      }
    });
    if (deleted) {
      next();
    }
  } else {
    next();
  }
};

export default dropToken;
