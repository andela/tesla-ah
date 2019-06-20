/* eslint-disable valid-jsdoc */
import models from '../sequelize/models';

const { Article, User } = models;

/**
 * @description Helpers for articles
 */
class checkOwner {
  /**
   * @author Audace Uhiriwe
   * @param {req} - request
   * @param {res} - response
   */
  static async articleOwner(req, res, next) {
    const { id } = req.user;
    const { slug } = req.params;

    // @check if that user is verified
    const { dataValues } = await User.findOne({ where: { id } });
    if (dataValues.verified === false) return res.status(403).send({ error: 'Please Verify your account, first!' });

    // @check if the article's slug exist
    const result = await Article.findOne({ where: { slug } });
    if (result === null) return res.status(404).send({ error: 'Slug Not found!' });

    // @check if the user who logged in - is the owner of that slug
    const response = await Article.findOne({ where: { slug, authorId: id } });
    if (!response) return res.status(403).send({ error: 'Sorry!, you are not the owner of this slug' });

    req.foundArticle = response.dataValues;
    return next();
  }
}
export default checkOwner;
