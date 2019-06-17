import models from '../../sequelize/models';
import tokenGeneration from '../../helpers/Token.helper';

const userInfo = {
  async googleLogin(req, res) {
    const { displayName } = req.user;
    const newUser = await models.User.create({
      firstName: req.user.name.givenName,
      lastName: req.user.name.familyName,
      email: req.user.emails[0].value,
      image: req.user.photos[0].value,
      provider: req.user.provider,
      verified: req.user.emails[0].verified,
      socialId: req.user.id,
    });
    if (newUser) {
      const {
        dataValues: {
          id, firstName, lastName, email, provider
        }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.status(200).json({
        message: `Welcome to Authors Haven ${displayName} `,
        data: {
          token, id, firstName, lastName, email, provider
        },
      });
    }
  },
  async facebookLogin(req, res) {
    const { displayName } = req.user;
    const names = displayName.split(' ');
    const newUser = await models.User.create({
      firstName: names[0],
      lastName: names[1],
      email: req.user.emails[0].value,
      image: req.user.photos[0].value,
      provider: req.user.provider,
      verified: true,
      socialId: req.user.id,
    });
    if (newUser) {
      const {
        dataValues: {
          id, firstName, lastName, email, provider
        }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.status(200).json({
        message: `Welcome to Authors Haven ${displayName} `,
        data: {
          token, id, firstName, lastName, email, provider
        },
      });
    }
  },
  async twitterLogin(req, res) {
    const {
      displayName
    } = req.user;
    const names = displayName.split(' ');
    const newUser = await models.User.create({
      firstName: names[0],
      lastName: names[1],
      username: req.user.username,
      image: req.user.photos[0].value,
      provider: req.user.provider,
      verified: true,
      socialId: req.user.id,
    });
    if (newUser) {
      const {
        dataValues: {
          id, firstName, lastName, email, provider
        }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.status(200).json({
        message: `Welcome to Authors Haven ${displayName} `,
        data: {
          token, id, firstName, lastName, email, provider
        },
      });
    }
  },
};
export default userInfo;
