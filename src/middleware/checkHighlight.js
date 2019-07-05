import models from '../sequelize/models';

const { Article, Highlights } = models;

/**
 * @class checkHighlight
 * @description a class to check if a highlight belongs to an article
 */
export default class checkHighlight {
  /**
      * Verify if a highlight belongs to an article
      * @param {Object} req - Request
      * @param {Object} res  - Response
      * @param {Function} next -Next
      * @returns {Object} The response object
      */
  static async highlights(req, res, next) {
    const { slug, highlightId } = req.params;
    const checkHighlights = await Highlights.findAll({
      where: {
        id: highlightId
      }
    });
    const getArticleId = await Article.findAll({
      where: {
        slug
      }
    });
    if (!checkHighlights[0]) {
      return res.status(400).json({
        message: 'This higlight does not exist!'
      });
    }
    if (checkHighlights[0].dataValues.articleId !== getArticleId[0].dataValues.id) {
      return res.status(400).json({
        message: 'This higlight does not belong to that article!'
      });
    }
    next();
  }
}
