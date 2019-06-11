import db from '../../sequelize/models';

const { LikeDislike } = db;

const likesCount = async (articleId) => {
  const likes = await LikeDislike.count({
    where: {
      articleId,
      likes: 1
    }
  });

  return likes;
};

export default likesCount;
