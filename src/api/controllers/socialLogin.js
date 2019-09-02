import models from '../../sequelize/models';
import tokenGeneration from '../../helpers/Token.helper';

const userInfo = {
  async googleLogin(req, res) {
    if (!req.user.name.familyName) {
      // eslint-disable-next-line prefer-destructuring
      req.user.name.familyName = req.user.name.givenName;
    }
    const newUser = await models.User.create({
      firstName: req.user.name.givenName,
      lastName: req.user.name.familyName,
      email: req.user.emails[0].value,
      username: `${req.user.name.familyName}${Date.now()}`,
      avatar: req.user.photos[0].value,
      provider: req.user.provider,
      verified: req.user.emails[0].verified,
      socialId: req.user.id,
    });
    if (newUser) {
      const {
        dataValues: {
          username,
        }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
  },
  async facebookLogin(req, res) {
    const { displayName } = req.user;
    const names = displayName.split(' ');
    if (!names[1]) {
      // eslint-disable-next-line prefer-destructuring
      names[1] = names[0];
    }
    const newUser = await models.User.create({
      firstName: names[0],
      lastName: names[1],
      email: req.user.emails[0].value,
      username: `${names[1]}${Date.now()}`,
      avatar: req.user.photos[0].value,
      provider: req.user.provider,
      verified: true,
      socialId: req.user.id,
    });
    if (newUser) {
      const {
        dataValues: {
          username,
        }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
  },
  async twitterLogin(req, res) {
    const {
      displayName
    } = req.user;
    const names = displayName.split(' ');
    if (!names[1]) {
      // eslint-disable-next-line prefer-destructuring
      names[1] = names[0];
    }
    const newUser = await models.User.create({
      firstName: names[0],
      lastName: names[1],
      username: `${names[1]}${Date.now()}`,
      avatar: req.user.photos[0].value,
      provider: req.user.provider,
      verified: true,
      socialId: req.user.id,
    });
    if (newUser) {
      const {
        dataValues: {
          username
        }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
  },
};
export default userInfo;
