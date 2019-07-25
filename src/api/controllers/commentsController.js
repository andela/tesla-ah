/* eslint-disable arrow-body-style */
import models from '../../sequelize/models';
import eventEmitter from '../../helpers/notifications/EventEmitter';
import findArticle from '../../helpers/article/findArticleWithComments';
import findWithSlug from '../../helpers/article/findWithSlug';
import likeOrDislike from '../../helpers/comment/LikeComment';
import commentLikes from '../../helpers/comment/likesCount';

/**
 * @class
 */
export default class Comments {
  /**
  * @description - Users should create comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async createComment(req, res) {
    const { comment } = req.body;
    const { slug } = req.params;
    const { id, firstName, lastName } = req.user;
    const data = await findWithSlug(slug);
    const commentAdded = await models.Comment.create({
      comment,
      userId: id,
      articleId: data.id,
      slug
    });
    const Id = commentAdded.dataValues.id;
    eventEmitter.emit('commentArticle', commentAdded.dataValues);
    return res.status(201).json({
      message: `Dear ${firstName}, Thank you for contributing to this article`,
      data: {
        id: Id,
        firstName,
        lastName,
        comment
      }
    });
  }

  /**
  * @description - Users should be able to comment a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async commentAcomment(req, res) {
    const { comment } = req.body;
    const { slug, commentId } = req.params;
    const { id, firstName, lastName } = req.user;
    const data = req.article;
    const commentAdded = await models.Comment.create({
      comment,
      userId: id,
      articleId: data.id,
      slug,
      commentId
    });
    const Id = commentAdded.dataValues.id;
    res.status(201).json({
      message: `Dear ${firstName}, Thank you for contributing to this comment!`,
      data: {
        id: Id,
        names: `${firstName} ${lastName}`,
        comment
      }
    });
  }

  /**
  * @description - Users should be able to edit a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async editComment(req, res) {
    const { comment } = req.body;
    const { commentId } = req.params;
    const findComment = req.comment;
    const { id } = req.user;
    const oldComment = findComment.comment;
    await models.Comment.update(
      {
        comment
      },
      { where: { id: commentId } }
    ).then(async () => {
      await models.CommentsHistory.create({
        userId: id,
        editedComment: oldComment,
        commentId: findComment.id
      });
      return res.status(200).json({
        message: 'Your comment has been edited',
        data: {
          comment
        }
      });
    });
  }

  /**
  * @description - Users should be able to delete a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async deleteComment(req, res) {
    const { roles } = req.user;
    const { commentId } = req.params;
    const { nestedComments } = req;
    if (nestedComments[0]) {
      await models.Comment.update(
        {
          comment: 'This comment has been deleted!'
        },
        { where: { id: commentId } }
      ).then(() => {
        return res.status(200).json({
          message: roles.includes('moderator' || 'admin') ? 'Comment deleted by moderator' : 'Comment deleted!'
        });
      });
    } else {
      await models.Comment.destroy({
        where: {
          id: commentId
        }
      }).then(() => {
        return res.status(200).json({
          message: 'Comment deleted!'
        });
      });
    }
  }

  /**
  * @description - Users should be able to get an article with its comments
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async getComment(req, res) {
    const { slug } = req.params;
    const findSlug = req.article;
    await models.Article.update(
      {
        views: findSlug.views += 1,
      },
      { where: { slug } }
    );

    const data = await findArticle(slug, findSlug.id);
    return res.status(200).json({
      data
    });
  }

  /**
  * @description - Users should be able to like a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async likeComment(req, res) {
    const { commentId } = req.params;
    const { id, firstName } = req.user;
    await likeOrDislike(id, commentId, true);

    return res.status(201).json({
      message: `Dear ${firstName}, Thank you for liking this comment!`
    });
  }

  /**
  * @description - Users should be able to dislike a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async dislikeComment(req, res) {
    const { firstName } = req.user;
    await likeOrDislike(req.user.id, req.params.commentId, false);
    res.status(200).json({
      message: `Dear ${firstName}, Thank you for disliking this comment!`
    });
  }

  /**
  * @description - Users should be able to like a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async countLikes(req, res) {
    const { commentId } = req.params;

    // Get comment likes
    const likeCount = await commentLikes(commentId);
    return res.json({
      status: 200,
      data: {
        commentId,
        likes: likeCount
      }
    });
  }

  /**
  * @description - Users should be able to dislike a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async countDislikes(req, res) {
    const { commentId } = req.params;

    // Get comment dislikes
    const dislikeCount = await models.LikeDislike.count({
      where: {
        commentId,
        dislikes: 1
      }
    });

    return res.status(200).json({
      status: 200,
      data: {
        commentId,
        dislikes: dislikeCount
      }
    });
  }

  /**
  * @description - Users should be able to track edit history
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async commentHistory(req, res) {
    const { history } = req;
    return res.status(200).json({
      data: history
    });
  }
}
