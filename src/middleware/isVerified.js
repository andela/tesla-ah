import db from '../sequelize/models';

const { User } = db;

const isVerified = async (req, res, next) => {
  const { id } = req.user;
  const currentUser = await User.findOne({
    where: {
      id
    }
  });
  if (!currentUser.verified) {
    return res.status(403).json({
      error: 'You have to verify your account first!'
    });
  }

  next();
};

export default isVerified;
