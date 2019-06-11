import db from '../sequelize/models';

const { LikeDislike } = db;
/**
 * @class
 */
class CheckArticleLikes {
  /**
   *
   * @param {Object} req - Request Object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   * @returns {Object} - Returns Response object
   */
  static async checkLikes(req, res, next) {
    const foundArticle = req.article;
    const { id } = req.user;
    const { slug } = req.params;

    const hasLiked = await LikeDislike.findOne({
      where: {
        articleId: foundArticle.id,
        userId: id,
        likes: 1
      }
    });
    if (hasLiked) {
      return res.status(400).json({
        error: `You already liked this article: ${slug}`
      });
    }
    next();
  }

  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   * @returns {Object} - Response Object
   */
  static async checkDislikes(req, res, next) {
    const { id } = req.user;
    const { slug } = req.params;
    const foundArticle = req.article;

    const hasDisliked = await LikeDislike.findOne({
      where: {
        articleId: foundArticle.id,
        userId: id,
        disliked: 1
      }
    });
    if (hasDisliked) {
      return res.status(400).json({
        error: `You already disliked this article: ${slug}`
      });
    }
    next();
  }
}

export default CheckArticleLikes;
