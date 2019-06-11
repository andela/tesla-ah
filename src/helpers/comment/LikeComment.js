import db from '../../sequelize/models';

const { LikeDislike } = db;

const likeDislike = async (userId, commentId, like) => {
  if (like) {
    await LikeDislike.create({
      userId,
      commentId,
      likes: 1,
      dislikes: 0
    });
  } else {
    await LikeDislike.create({
      userId,
      commentId,
      likes: 0,
      dislikes: 1
    });
  }

  return true;
};

export default likeDislike;
