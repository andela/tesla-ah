import models from '../sequelize/models';

const validComment = {
  async checkComment(req, res, next) {
    const { slug, commentId } = req.params;
    if (commentId) {
      const findComment = await models.Comment.findAll({
        where: {
          slug,
          id: commentId
        }
      });
      if (findComment.length === 0) {
        return res.status(400).json({
          message: 'That comment does not belong to this article!'
        });
      }
    }
    next();
  },
  async checkParameter(req, res, next) {
    const { commentId } = req.params;
    const isInteger = /^[0-9]+$/;
    if (!isInteger.test(commentId)) {
      return res.status(400).json({
        message: 'The comment Id should be an integer!'
      });
    }
    const findComment = await models.Comment.findAll({
      where: {
        id: commentId
      }
    });
    if (findComment.length === 0) {
      return res.status(404).json({
        message: 'That comment does not exist!'
      });
    }
    next();
  },
  async articleExists(req, res, next) {
    const { slug } = req.params;
    const data = await models.Article.findAll({
      where: {
        slug
      },
    });
    if (data.length === 0) {
      return res.status(404).json({
        message: 'The article you are trying to comment was not found'
      });
    }
    return next();
  }
};
export default validComment;
