import models from '../../sequelize/models';

import AuthorNotifier from '../../helpers/NotifyAuthorOnArticleBlock';

const {
  notifyAuthorblock, notifyAuthorUnblock
} = AuthorNotifier;
const {
  Article, BlockedArticles, ReportedArticles, User
} = models;

// eslint-disable-next-line no-array-constructor
const days = new Array(
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
);

/**
 * @class
 */
class ArticleBlocks {
  /**
  * @param  {object} req
  * @param  {object} res
  * @return {object} returns a message with operation status
  */
  static async reportArticle(req, res) {
    const { username } = req.user;
    const { comment } = req.body;
    const { slug } = req.params;
    ReportedArticles.create({
      slug,
      comment,
      username,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then((out) => {
      res.status(201).send({
        status: 201,
        data: out
      });
    });
  }

  /**
 * @param  {object} req
 * @param  {object} res
 * @return {object} returns a message with operation status
 */
  static async blockArticle(req, res) {
    const { slug } = req.params;
    const { user } = req;
    const { description } = req.body;
    const article = await Article.findOne({ where: { slug } });
    const reporterUsername = await ReportedArticles.findOne({
      where: { slug }
    });
    const { dataValues: { email, lastName } } = await User.findOne({
      where: { id: article.authorId }
    });
    const username = !reporterUsername
      ? null
      : reporterUsername.dataValues.username;
    const repoterId = username === null ? null : await User.findOne({ where: { username } });
    const id = repoterId === null ? null : repoterId.dataValues.id;
    const object = {
      reporterId: id,
      articleId: article.id,
      authorId: article.authorId,
      moderatorId: user.id,
      blockedDay: days[new Date().getDay() - 1] || 'Sunday',
      description
    };
    BlockedArticles.create(object).then(async (responce) => {
      await Article.update(
        { blocked: true },
        { where: { id: responce.articleId } }
      );
      await notifyAuthorblock({ email, lastName });
      res.status(201).send({
        status: 201,
        data: {
          message: 'Article blocked successfully',
          responce
        }
      });
    });
  }

  /**
  * @param  {object} req
  * @param  {object} res
  * @return {object} returns a message with operation status
  */
  static async unBlockArticle(req, res) {
    const { slug } = req.params;
    const { id, authorId } = await Article.findOne({ where: { slug } });

    const { dataValues: { email, lastName } } = await User.findOne({
      where: { id: authorId }
    });

    BlockedArticles.destroy({ where: { articleId: id } }).then(async () => {
      await Article.update({ blocked: false }, { where: { slug } });
      await notifyAuthorUnblock({ email, lastName, slug });
      res.status(200).send({
        status: 200,
        data: {
          message: 'Article unblocked successfully'
        }
      });
    });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status
   */
  static async getBlockedArticles(req, res) {
    const blockedArticles = await BlockedArticles.findAll({});
    return res.status(200).json({ status: 200, data: blockedArticles });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status
   */
  static async getReportedArticles(req, res) {
    const reportedArticles = await ReportedArticles.findAll({});
    res.json({ status: 200, data: reportedArticles });
  }
}

export default ArticleBlocks;
