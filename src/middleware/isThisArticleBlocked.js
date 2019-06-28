import db from '../sequelize/models/index';

const { BlockedArticles } = db;

const isthisAricleBlocked = async (req, res, next) => {
  const { article } = req;
  const blockedArticle = await BlockedArticles.findOne({
    where: { articleId: article.id }
  });
  if (blockedArticle) {
    return res.status(200).send({
      status: 200,
      error: {
        message: 'This article is blocked'
      }
    });
  }
  next();
};

export default isthisAricleBlocked;
