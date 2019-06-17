import models from '../sequelize/models';

models.User.destroy({
  where: {},
  truncate: false
});
