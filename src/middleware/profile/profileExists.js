import db from '../../sequelize/models';

const { User } = db;

const userExists = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({
      error: 'User you want to update is not available'
    });
  }

  next();
};

export default userExists;
