import db from '../../sequelize/models';

const { LikeDislike } = db;

const hasDislikedComment = async (userId, commentId) => {
  const disliked = await LikeDislike.findOne({
    where: {
      commentId,
      userId,
      dislikes: 1
    }
  });
  return !!disliked;
};

export default hasDislikedComment;
