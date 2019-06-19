import models from '../sequelize/models';

models.ArticleRatings.destroy({
  where: {},
  truncate: false
});
