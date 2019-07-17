import models from '../sequelize/models';

const validUser = {
  async emailExists(req, res, next) {
    const { email } = req.body;
    await models.User.findAll({
      where: {
        email
      },
    }).then((data) => {
      if (data.length > 0) {
        return res.status(400).json({
          status: 400,
          message: 'This email is already in use',
        });
      }
    });

    next();
  },
  async usernameExists(req, res, next) {
    const { username } = req.body;
    await models.User.findAll({
      where: {
        username
      },
    }).then((data) => {
      if (data.length > 0) {
        return res.status(400).json({
          status: 400,
          message: 'This username is not available, Please choose another one!',
        });
      }
    });

    next();
  },
};


export default validUser;
