import db from '../../sequelize/models';

const { LikeDislike } = db;

const commentLikes = async (commentId) => {
  const count = await LikeDislike.count({
    where: {
      id: commentId,
      likes: 1
    }
  });

  return count;
};

export default commentLikes;
