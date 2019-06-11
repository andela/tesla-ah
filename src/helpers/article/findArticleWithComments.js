import db from '../../sequelize/models';

const { Article, Comment } = db;

const findArticle = async (slug, articleId) => {
  const article = await Article.findOne({
    attributes: ['title', 'description', 'body'],
    where: {
      slug
    },
    include: [{
      model: Comment,
      attributes: ['id', 'comment'],
      where: {
        articleId,
        commentId: null
      },
      include: [{
        model: Comment,
        attributes: ['id', 'comment']
      }]
    }]
  });

  return article || {};
};

export default findArticle;
