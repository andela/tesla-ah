import db from '../../sequelize/models';

const { User } = db;

const userExists = async (req, res, next) => {
  const { email } = req.body;
  const users = await User.findOne({ where: { email } })
    || await User.findOne({ where: { username: email } });
  if (!users) {
    return res.status(404).send({
      error: 'User with that email or username does not exist.'
    });
  }
  req.users = users;
  next();
};

export default userExists;
