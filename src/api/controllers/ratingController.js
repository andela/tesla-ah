/* eslint-disable require-jsdoc */
import db from '../../sequelize/models';

const { ArticleRatings } = db;
/**
 * @author Diane Mahoro
 * @class Rating
 * @description this class performs the whole of rating
 */

class Ratings {
  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async createRatings(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const { rating } = req.body;


    const data = {
      slug,
      userId: id,
      rating: parseInt(rating, 10)
    };
    const response = await ArticleRatings.findAll({
      where: {
        slug,
        userId: id
      }
    });
    if (!response[0]) {
      const NewRating = await ArticleRatings.create({
        slug: data.slug,
        userId: data.userId,
        ratings: data.rating
      });
      res.status(201).json({
        data: NewRating,
        message: 'created'
      });
    }
    return res.status(403).json({
      Error: 'You are not allowed to rate this article more than once, but you can update your ratings.'
    });
  }

  static async UpdateRatings(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const { rating } = req.body;

    const data = {
      rating: parseInt(rating, 10)
    };

    const response = await ArticleRatings.findAll({
      where: {
        slug,
        userId: id
      }
    });
    if (response) {
      await ArticleRatings.update(
        { ratings: data.rating },
        { where: { slug, userId: id }, logging: false }
      );

      res.status(200).json({
        NewRate: data.rating,
        message: 'updated',
      });
    }
  }
}
export default Ratings;
