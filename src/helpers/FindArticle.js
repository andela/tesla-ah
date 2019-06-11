import db from '../sequelize/models';

const { Article } = db;

const findArticle = async (article) => {
  const { datavalues } = await Article.findOne({
    where: {
      slug: article.slug
    }
  });
  return datavalues || {};
};

export default findArticle;
