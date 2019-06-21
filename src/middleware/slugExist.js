import db from '../sequelize/models/index';

const { Article } = db;

const slugExist = async (req, res, next) => {
  const { slug } = req.params;
  const currentArticle = await Article.findOne({
    where: { slug }
  });
  if (!currentArticle) {
    return res.status(404).json({
      error: 'The article does not exist!!!'
    });
  }
  next();
};

export default slugExist;
