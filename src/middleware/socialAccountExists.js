import models from '../sequelize/models';
import tokenGeneration from '../helpers/Token.helper';

const userExists = {
  async google(req, res, next) {
    const { emails } = req.user;
    const currentUser = await models.User.findAll({
      where: {
        email: emails[0].value,
      },
    });
    if (currentUser.length > 0) {
      const token = await tokenGeneration.generateToken(currentUser[0].dataValues);
      const {
        username
      } = currentUser[0].dataValues;
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
    next();
  },
  async twitter(req, res, next) {
    const currentUser = await models.User.findAll({
      where: {
        socialId: req.user.id,
      },
    });
    if (currentUser.length > 0) {
      const token = await tokenGeneration.generateToken(currentUser[0].dataValues);
      const {
        username
      } = currentUser[0].dataValues;
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
    next();
  },
};
export default userExists;
