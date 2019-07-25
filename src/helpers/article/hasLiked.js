import db from '../../sequelize/models';

const { LikeDislike } = db;

const hasLiked = async (articleId, userId) => {
  const { id } = await LikeDislike.findOne({
    where: {
      articleId,
      userId,
      likes: 1
    }
  });

  return { id } || null;
};

export default hasLiked;
