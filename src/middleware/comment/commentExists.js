import db from '../../sequelize/models';

const { Comment } = db;

const commentExists = async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return res.status(404).json({
      status: 404,
      error: 'Comment not found!'
    });
  }

  req.comment = comment;
  next();
};

export default commentExists;
