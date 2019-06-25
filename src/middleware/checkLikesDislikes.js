import models from '../sequelize/models';

/**
 * @class checkLikesDislikes
 * @description a class to check if a user has already like or disliked a comment
 */
export default class checkLikesDislikes {
  /**
    * Verify if the user has already liked the comment
    * @param {Object} req - Request
    * @param {Object} res  - Response
    * @param {Function} next -Next
    * @returns {Object} The response object
    */
  static async liked(req, res, next) {
    const { commentId } = req.params;
    const { id, firstName } = req.user;
    const hasLiked = await models.LikeDislike.findAll({
      where: {
        commentId,
        userId: id,
        likes: 1
      }
    });
    // If the user has already liked that comment
    if (hasLiked[0]) {
      return res.status(400).json({
        message: `Dear ${firstName}, You have already liked this comment!`
      });
    }
    next();
  }

  /**
    * Verify if the user has already disliked the comment
    * @param {Object} req - Request
    * @param {Object} res  - Response
    * @param {Function} next -Next
    * @returns {Object} The response object
    */
  static async disliked(req, res, next) {
    const { commentId } = req.params;
    const { id, firstName } = req.user;
    const hasDisliked = await models.LikeDislike.findAll({
      where: {
        commentId,
        userId: id,
        dislikes: 1
      }
    });
    // If the user has already disliked that comment
    if (hasDisliked[0]) {
      return res.status(400).json({
        message: `Dear ${firstName}, You have already disliked this comment!`
      });
    }
    next();
  }
}
