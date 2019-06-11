import models from '../../sequelize/models';
import shareCount from '../../helpers/stats/shareCount';
import commentCount from '../../helpers/stats/commentCount';

const {
  Article,
  Share
} = models;

/**
 * @Author - Mireille Niwemuhuza
 */
class StatsController {
  /**
   *  @description - Users should be able to view how many times an article has been viewed
   *  @param {object} req - Request object
   *  @param {object} res - Response object
   *  @return {object} - Response object
   */
  static async getViews(req, res) {
    const { slug } = req.params;
    const articleViews = await Article.findAll({
      attributes: ['title', 'views'],
      where: {
        slug
      }
    });
    const { title, views } = articleViews[0];
    return res.status(200).json({
      data: { title, views }

    });
  }

  /**
   * @description - Users should be able to view the number of comments on an article
   * @param {Object} req - Request Object
   * @param {Object} res  - Response Object
   * @returns {Object} - Response object
   */
  static async commentNumber(req, res) {
    const { slug } = req.params;

    const count = await commentCount(slug);
    return res.status(200).json({
      status: 200,
      data: {
        slug,
        comments: count
      }
    });
  }

  /**
   * @description - Users should be able to view the number of shares on facebook
   * @param {Object} req - Request Object
   * @param {Object} res  - Response Object
   * @returns {Object} - Response object
   */
  static async facebookShares(req, res) {
    const { slug } = req.params;

    const shares = await shareCount(slug, 'facebook');

    res.status(200).json({
      status: 200,
      data: {
        slug,
        shares
      }
    });
  }

  /**
   * @description - Users should be able to view the number of shares on twitter
   * @param {Object} req - Request Object
   * @param {Object} res  - Response Object
   * @returns {Object} - Response object
   */
  static async twitterShares(req, res) {
    const { slug } = req.params;

    // Count shares on twitter
    const shares = await shareCount(slug, 'twitter');
    return res.status(200).json({
      data: {
        slug,
        shares
      }
    });
  }

  /**
   * @description - Users should be able to view the number of shares on email
   * @param {Object} req - Request Object
   * @param {Object} res  - Response Object
   * @returns {Object} - Response object
   */
  static async emailShares(req, res) {
    const { slug } = req.params;

    // Count shares on email
    const count = await shareCount(slug, 'email');

    return res.json({
      status: 200,
      data: {
        slug,
        shares: count
      }
    });
  }

  /**
   * @description - Users should be able to view the number of shares on email
   * @param {Object} req - Request Object
   * @param {Object} res  - Response Object
   * @returns {Object} - Response object
   */
  static async shares(req, res) {
    const { slug } = req.params;

    // Count shares on email
    const shares = await Share.count({
      where: {
        slug
      }
    });

    return res.status(200).json({
      status: 200,
      data: {
        slug,
        shares
      }
    });
  }
}
export default StatsController;
