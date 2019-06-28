import db from '../sequelize/models';

const { Article } = db;

const paginate = async (req, res, next) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  if (
    typeof pageNumber === 'number'
      && typeof limitNumber === 'number'
      && typeof page !== 'undefined'
      && typeof limit !== 'undefined'
  ) {
    if (pageNumber <= 0 || limitNumber <= 0) {
      return res.status(400).json({
        error: 'Invalid request'
      });
    }
    const offset = limitNumber * (pageNumber - 1);
    const foundArticles = await Article.findAll({
      limit: limitNumber,
      offset
    });
    return res.json({
      data: foundArticles
    });
  }
  next();
};

export default paginate;
