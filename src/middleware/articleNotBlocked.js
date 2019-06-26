import db from '../sequelize/models/index';

const { BlockedArticles } = db;

const notblocked = async (req, res, next) => {
  const { article } = req;
  const blockedArticle = await BlockedArticles.findOne({
    where: { articleId: article.id }
  });
  if (!blockedArticle) {
    return res.status(400).send({
      status: 400,
      error: {
        message: 'The article you are trying to unblock is not blocked.'
      }
    });
  }
  next();
};

export default notblocked;
