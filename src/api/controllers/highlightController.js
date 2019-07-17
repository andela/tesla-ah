import db from '../../sequelize/models';

const { Highlights } = db;
/**
 * @author Diane Mahoro
 * @class Highlight
 * @description this class performs the whole of highlightings
 */
class Highlight {
  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async createHighlights(req, res) {
    const { id } = req.user;
    const {
      highlightText, comment, occurencyNumber
    } = req.body;
    const { article } = req; // This contains the article
    const newHighlight = await Highlights.create({
      articleId: article.id,
      userId: id,
      highlightText,
      comment,
      occurencyNumber,
    });
    return res.status(201).json({
      Message: `Thank you for highlighting this text ${newHighlight.highlightText}`,
      data: newHighlight
    });
  }
}

export default Highlight;
