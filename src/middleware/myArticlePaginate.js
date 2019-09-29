import db from '../sequelize/models';

const { Article } = db;

const myArticlePagination = async (req, res, next) => {
  const { page, limit } = req.query;
  const { id } = req.user;
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
    const count = await Article.count({ where: { authorId: id } });
    const foundArticles = await Article.findAll({
      where: { authorId: id },
      limit: limitNumber,
      offset,
      order: [['updatedAt', 'ASC']]
    });
    return res.json({
      data: { foundArticles, count }
    });
  }
  next();
};

export default myArticlePagination;
