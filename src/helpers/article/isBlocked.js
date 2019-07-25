import db from '../../sequelize/models';

const { BlockedArticles } = db;

const isArticleBlocked = async (articleId) => {
  const blocked = await BlockedArticles.findOne({
    where: {
      articleId
    }
  });

  return !!blocked;
};

export default isArticleBlocked;
