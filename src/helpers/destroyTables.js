import models from '../sequelize/models';

models.ArticleRatings.destroy({
  where: {},
  truncate: true
});
models.Article.destroy({
  where: {},
  truncate: false
});
models.Blacklist.destroy({
  where: {},
  truncate: false
});
models.Comment.destroy({
  where: {},
  truncate: false
});
models.LikeDislike.destroy({
  where: {},
  truncate: false
});
models.ReportedArticles.destroy({
  where: {},
  truncate: false
});
models.User.destroy({
  where: {},
  truncate: false
});
models.Blacklist.destroy({
  where: {},
  truncate: true
});
models.Comment.destroy({
  where: {},
  truncate: true
});
