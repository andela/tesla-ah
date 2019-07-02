/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import models from '../../sequelize/models';
import tokenGeneration from '../../helpers/Token.helper';

const userInfo = {
  async googleLogin(req, res) {
    const { displayName } = req.user;
    const newUser = await models.User.create({
      firstName: req.user.name.givenName,
      lastName: req.user.name.familyName,
      email: req.user.emails[0].value,
      avatar: req.user.photos[0].value,
      provider: req.user.provider,
      verified: req.user.emails[0].verified,
      socialId: req.user.id
    });
    if (newUser) {
      const {
        dataValues: { username }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
  },
  async facebookLogin(req, res) {
    const { displayName } = req.user;
    const names = displayName.split(' ');
    const newUser = await models.User.create({
      firstName: names[0],
      lastName: names[1],
      email: req.user.emails[0].value,
      avatar: req.user.photos[0].value,
      provider: req.user.provider,
      verified: true,
      socialId: req.user.id
    });
    if (newUser) {
      const {
        dataValues: { username }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
  },
  async twitterLogin(req, res) {
    const { displayName } = req.user;
    const names = displayName.split(' ');
    const newUser = await models.User.create({
      firstName: names[0],
      lastName: names[1],
      username: req.user.username,
      avatar: req.user.photos[0].value,
      provider: req.user.provider,
      verified: true,
      socialId: req.user.id
    });
    if (newUser) {
      const {
        dataValues: { username }
      } = newUser;
      const token = await tokenGeneration.generateToken(newUser.dataValues);
      return res.redirect(`${process.env.APP_URL_FRONTEND}/?token=${token}&username=${username}`);
    }
  }
};
export default userInfo;
