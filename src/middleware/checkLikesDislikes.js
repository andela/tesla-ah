
import hasLiked from '../helpers/comment/hasLiked';
import hasDisliked from '../helpers/comment/hasDisliked';

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
    const isLiked = await hasLiked(id, commentId);
    return isLiked ? res.status(400).json({
      message: `Dear ${firstName}, you have already liked this comment!`
    }) : next();
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
    const isDisliked = await hasDisliked(id, commentId);
    if (isDisliked) {
      return res.status(400).json({
        message: `Dear ${firstName}, you have already disliked this comment!`
      });
    }
    next();
  }
}
