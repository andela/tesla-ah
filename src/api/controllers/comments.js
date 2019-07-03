/* eslint-disable arrow-body-style */
import models from '../../sequelize/models';
import eventEmitter from '../../helpers/notifications/EventEmitter';

/**
 * @class
 */
export default class comments {
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
    const data = await models.Article.findAll({
      where: {
        slug
      }
    });
    const commentAdded = await models.Comment.create({
      comment,
      userId: id,
      articleId: data[0].dataValues.id,
      slug
    });
    const Id = commentAdded.dataValues.id;
    eventEmitter.emit('commentArticle', commentAdded.dataValues);
    return res.status(201).json({
      message: `Dear ${firstName}, Thank you for contributing to this article`,
      data: {
        Id,
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
    const data = await models.Article.findAll({
      where: {
        slug
      }
    });
    const commentAdded = await models.Comment.create({
      comment,
      userId: id,
      articleId: data[0].dataValues.id,
      slug,
      commentId
    });
    const Id = commentAdded.dataValues.id;
    return res.status(201).json({
      message: `Dear ${firstName}, Thank you for contributing to this comment`,
      data: {
        Id,
        firstName,
        lastName,
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
    const findComment = await models.Comment.findAll({
      where: {
        id: commentId
      }
    });
    const { userId } = findComment[0].dataValues;
    const { id, firstName } = req.user;
    if (userId === id) {
      const oldComment = findComment[0].dataValues.comment;
      await models.Comment.update(
        {
          comment
        },
        { where: { id: commentId } }
      ).then(async () => {
        await models.CommentsHistory.create({
          userId: id,
          editedComment: oldComment,
          commentId: findComment[0].dataValues.id
        });
        return res.status(200).json({
          message: 'Your comment has been edited',
          data: {
            comment
          }
        });
      });
    } else {
      return res.status(403).json({
        message: `Dear ${firstName}, You do not have the right to edit this comment!`
      });
    }
  }

  /**
  * @description - Users should be able to delete a comment
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async deleteComment(req, res) {
    const { id, firstName, roles } = req.user;
    const { commentId } = req.params;
    const findComment = await models.Comment.findAll({
      where: {
        id: commentId
      }
    });
    const nestedComments = await models.Comment.findAll({
      where: {
        commentId
      }
    });
    const { userId } = findComment[0].dataValues;
    if (userId === id || roles.includes('moderator' || 'admin')) {
      if (nestedComments[0]) {
        await models.Comment.update(
          {
            comment:
              'This comment has been deleted!'
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
    return res.status(403).json({
      message: `Dear ${firstName}, You do not have the right to delete this comment!`
    });
  }

  /**
  * @description - Users should be able to get an article with its comments
  * @param {Object} req - Request Object
  * @param {Object} res  - Response Object
  * @returns {Object} - Response object
  */
  static async getComment(req, res) {
    const { slug } = req.params;
    const findSlug = await models.Article.findAll({
      attributes: ['id', 'views'],
      where: {
        slug
      }
    });
    if (findSlug.length === 0) {
      return res.status(404).json({
        message: 'Not found!'
      });
    }
    await models.Article.update(
      {
        views: findSlug[0].dataValues.views += 1,
      },
      { where: { slug } }
    );
    await models.Article.findAll({
      attributes: [
        'title',
        'description',
        'body'
      ],
      where: {
        slug
      },
      include: [
        {
          model: models.Comment,
          attributes: ['comment'],
          where: {
            articleId: findSlug[0].dataValues.id,
            commentId: null
          },
          include: [
            {
              model: models.Comment,
              attributes: ['comment']
            }
          ]
        }
      ]
    }).then((data) => {
      if (data) {
        return res.status(200).json({
          data
        });
      }
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
    const hasDisliked = await models.LikeDislike.findAll({
      where: {
        commentId,
        userId: id,
        dislikes: 1
      }
    });
    if (hasDisliked[0]) {
      await models.LikeDislike.update(
        { dislikes: 0, likes: 1 },
        { where: { id: hasDisliked[0].id } }
      );
      return res.status(200).json({
        message: `Dear ${firstName}, Thank you for liking this comment!`
      });
    }
    await models.LikeDislike.create({
      userId: id,
      commentId,
      dislikes: 0,
      likes: 1
    });

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
    const { commentId } = req.params;
    const { id, firstName } = req.user;
    const hasLiked = await models.LikeDislike.findAll({
      where: {
        commentId,
        userId: id,
        likes: 1
      }
    });
    if (hasLiked[0]) {
      await models.LikeDislike.update(
        { dislikes: 1, likes: 0 },
        { where: { id: hasLiked[0].id } }
      );
      return res.status(200).json({
        message: `Dear ${firstName}, Thank you for disliking this comment!`
      });
    }
    await models.LikeDislike.create({
      userId: id,
      commentId,
      dislikes: 1,
      likes: 0
    });

    return res.status(201).json({
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
    const likeCount = await models.LikeDislike.count({
      where: {
        commentId,
        likes: 1
      }
    });
    return res.status(200).json({
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
    const { commentId } = req.params;
    const { id, roles } = req.user;
    const findHistory = await models.CommentsHistory.findAll({
      where: {
        commentId
      }
    });
    if (findHistory.length === 0) {
      return res.status(404).json({
        message: 'No edit history for this comment!'
      });
    }
    if (findHistory[0].dataValues.userId === id || roles.includes('moderator' || 'admin')) {
      return res.status(200).json({
        data: {
          findHistory
        }
      });
    }
    return res.status(403).json({
      message: 'You do not have the right to view this history!'
    });
  }
}
