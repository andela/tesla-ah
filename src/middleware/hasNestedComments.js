import db from '../sequelize/models';

const { Comment } = db;
const hasNested = async (req, res, next) => {
  const { commentId } = req.params;
  const foundComment = await Comment.findByPk(commentId);
  if (!foundComment) {
    return res.status(404).json({
      error: 'No Comment found!'
    });
  }
  const nestedComments = await Comment.findAll({
    where: {
      commentId
    }
  });

  const { userId } = foundComment;
  req.nestedComments = nestedComments;
  req.userToDelete = userId;
  next();
};

export default hasNested;
