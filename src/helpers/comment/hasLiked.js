import db from '../../sequelize/models';

const { LikeDislike } = db;

const hasLikedComment = async (userId, commentId) => {
  const liked = await LikeDislike.findOne({
    where: {
      commentId,
      userId,
      likes: 1
    }
  });
  return !!liked;
};

export default hasLikedComment;
