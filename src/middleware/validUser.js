import models from '../sequelize/models';
import findByUsername from '../helpers/user/findUserByUsername';
import findByEmail from '../helpers/user/findUserByEmail';

const validUser = {
  async emailExists(req, res, next) {
    const { email } = req.body;
    const user = await findByEmail(email);
    return user ? res.status(400).json({
      error: 'This email is already in use'
    }) : next();
  },
  async usernameExists(req, res, next) {
    const { username } = req.body;
    const user = await findByUsername(username);
    if (user) {
      return res.status(400).json({
        error: 'This username is not available, try another one'
      });
    }
    next();
  },
  async userNameExist(req, res, next) {
    const { username } = req.params;
    const user = await models.User.findAll({
      where: {
        username
      }
    });
    if (!user.length) {
      return res.status(404).json({
        error: 'username does not exist'
      });
    }

    next();
  }

};

export default validUser;
