import db from '../../sequelize/models';

const { Article } = db;

const findArticle = async (slug) => {
  const article = await Article.findOne({
    where: {
      slug
    }
  });

  return article;
};

export default findArticle;
