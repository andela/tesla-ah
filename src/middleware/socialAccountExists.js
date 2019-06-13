import models from '../sequelize/models';
import tokenGeneration from '../helpers/Token.helper';

const userExists = {
  async google(req, res, next) {
    const { emails, displayName } = req.user;
    const currentUser = await models.User.findAll({
      where: {
        email: emails[0].value,
      },
    });
    if (currentUser.length > 0) {
      const token = await tokenGeneration.generateToken(currentUser[0].dataValues);
      const {
        id, firstName, lastName, email, socialId, provider
      } = currentUser[0].dataValues;
      return res.status(200).json({
        message: `Welcome to Authors Haven ${displayName} `,
        data: {
          token,
          id,
          firstName,
          lastName,
          email,
          socialId,
          provider
        },
      });
    }
    next();
  },
  async twitter(req, res, next) {
    const { displayName } = req.user;
    const currentUser = await models.User.findAll({
      where: {
        socialId: req.user.id,
      },
    });
    if (currentUser.length > 0) {
      const token = await tokenGeneration.generateToken(currentUser[0].dataValues);
      const {
        id, firstName, lastName, socialId, provider
      } = currentUser[0].dataValues;
      return res.status(200).json({
        message: `Welcome to Authors Haven ${displayName} `,
        data: {
          token,
          id,
          firstName,
          lastName,
          socialId,
          provider,
        },
      });
    }
    next();
  },
};
export default userExists;
