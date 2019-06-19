import sequelize from 'sequelize';
import calcRatings from 'ratingpercentage';
import db from '../../sequelize/models/index';

const { ArticleRatings } = db;

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
                    '1st': Number(report.oneStars),
                    '2st': Number(report.twoStars),
                    '3st': Number(report.threeStars),
                    '4st': Number(report.fourStars),
                    '5st': Number(report.fiveStars),
                    'Number of User ': Number(report.totalCounts),
                    'Total Ratings': Number(report.totalRatings),
                    Average: Number(report.average)
                  },
                  percentage: {
                    '1st': `${percentage.oneStars} %`,
                    '2st': `${percentage.twoStars} %`,
                    '3st': `${percentage.threeStars} %`,
                    '4st': `${percentage.fourStars} %`,
                    '5st': `${percentage.fiveStars} %`
                  }
                }
              });
            });
        }
      });
  }
}
export default Ratings;
