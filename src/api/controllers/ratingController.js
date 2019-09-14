import sequelize from 'sequelize';
import calcRatings from 'ratingpercentage';
import db from '../../sequelize/models/index';

const { ArticleRatings, Article } = db;

/**
 * @author Eric Rukundo
 * @class ArticleRatings
 * @description this class performs the whole authentication
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
    const isOwner = await Article.findOne({ where: { slug, authorId: id } });
    if (isOwner !== null) return res.status(403).send({ status: 403, error: 'You are not allowed to rate your own article' });
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
      return res.status(201).send({
        data: NewRating,
        message: 'created'
      });
    }
    return res.status(400).send({
      status: 400,
      error: 'You are not allowed to rate this article more than once, but you can update your ratings.'
    });
  }

  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
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

      res.status(200).send({
        NewRate: data.rating,
        message: 'updated',
      });
    }
  }

  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async calculateArticleRatings(req, res) {
    const { slug } = req.params;
    ArticleRatings
      .findAll({
        where: {
          slug
        },
        group: ['ratings'],
        attributes: ['ratings', [sequelize.fn('COUNT', 'TagName'), 'count']]
      })
      .then((output) => {
        if (!output[0]) {
          res.status(404).send({
            status: 404,
            error: {
              message: 'No any rating found for that article'
            }
          });
        } else {
          calcRatings
            .setInput(output)
            .getResult()
            .then(({ report, percentage }) => {
              res.status(200).send({
                status: 200,
                data: {
                  report: {
                    OneStar: Number(report.oneStars),
                    TwoStar: Number(report.twoStars),
                    ThreeStar: Number(report.threeStars),
                    FourStar: Number(report.fourStars),
                    FiveStar: Number(report.fiveStars),
                    NumberOfUser: Number(report.totalCounts),
                    TotalRatings: Number(report.totalRatings),
                    Average: Number(report.average)
                  },
                  percentage: {
                    OneStar: `${Math.ceil(percentage.oneStars)} %`,
                    TwoStar: `${Math.ceil(percentage.twoStars)} %`,
                    ThreeStar: `${Math.ceil(percentage.threeStars)} %`,
                    FourStar: `${Math.ceil(percentage.fourStars)} %`,
                    FiveStar: `${Math.ceil(percentage.fiveStars)} %`
                  }
                }
              });
            });
        }
      });
  }
}
export default Ratings;
