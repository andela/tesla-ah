import db from '../../sequelize/models';

const { LikeDislike } = db;

const dislikesCount = async (articleId) => {
  const dislikes = await LikeDislike.count({
    where: {
      articleId,
      dislikes: 1
    }
  });
  return dislikes;
};

export default dislikesCount;
