import db from '../../sequelize/models';

const { LikeDislike } = db;

const hasDisliked = async (articleId, userId) => {
  const { id } = await LikeDislike.findOne({
    where: {
      articleId,
      userId
    }
  });

  return { id } || null;
};

export default hasDisliked;
