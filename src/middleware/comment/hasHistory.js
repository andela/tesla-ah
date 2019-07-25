import db from '../../sequelize/models';

const { CommentsHistory } = db;

const hasHistory = async (req, res, next) => {
  const { commentId } = req.params;

  const history = await CommentsHistory.findAll({
    where: {
      commentId
    }
  });
  if (!history.length) {
    return res.json({
      message: 'No comment history yet!',
      data: history
    });
  }
  req.history = history;
  next();
};

export default hasHistory;
