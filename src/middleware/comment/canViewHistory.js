import db from '../../sequelize/models';

const { CommentsHistory } = db;

const canViewHistory = async (req, res, next) => {
  const { id, roles } = req.user;
  const { commentId } = req.params;
  const history = await CommentsHistory.findAll({
    where: {
      commentId
    }
  });
  if (!(history[0].userId === id || roles.includes('moderator' || 'admin'))) {
    return res.status(403).json({
      error: 'You do not have the right to view this history!'
    });
  }
  next();
};

export default canViewHistory;
