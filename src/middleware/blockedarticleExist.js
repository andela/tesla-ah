import db from '../sequelize/models/index';

const { BlockedArticles } = db;

const blockedExist = async (req, res, next) => {
  const { article } = req;
  const blockedArticle = await BlockedArticles.findOne({
    where: { articleId: article.id }
  });
  if (blockedArticle) {
    return res.status(400).send({
      status: 400,
      error: {
        message: 'This article is already blocked'
      }
    });
  }
  next();
};

export default blockedExist;
