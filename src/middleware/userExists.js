import models from '../sequelize/models';

const checkEmail = {
  async userExist(req, res, next) {
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
};

export default checkEmail;
