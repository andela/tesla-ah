import models from '../sequelize/models';

const usernameAvailability = {
  async usernameExist(req, res, next) {
    const { username } = req.params;
    // console.log(username);
    const user = await models.User.findAll({
      where: {
        username
      }
    });
    // console.log(user);
    if (!user.length) {
      return res.status(404).json({
        error: 'username does not exist'
      });
    }

    next();
  }
};

export default usernameAvailability;
