/* eslint-disable import/no-cycle */
import articles from '../../helpers/articlesHelper';
import models from '../../sequelize/models';
import readTime from '../../helpers/ReadTime.helper';
import eventEmitter from '../../helpers/notifications/EventEmitter';
import findUser from '../../helpers/FindUser';
import AuthorNotifier from '../../helpers/NotifyAuthorOnArticleBlock';
import workers from '../../workers';

const {
  notifyAuthorblock, notifyAuthorUnblock
} = AuthorNotifier;
const { uploadImageWorker } = workers;

const {
  User,
  Article,
  LikeDislike,
  ReportedArticles,
  BlockedArticles,
  Share
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
 * @Author - Audace Uhiriwe
 */
class articlesController {
  /**
   * creating a new article
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns created article
   */
  static async createArticle(req, res) {
    const { id } = req.user;

    // @check if that user is verified
    const user = await User.findOne({ where: { id } });
    if (user.dataValues.verified === false) {
      return res
        .status(403)
        .send({ error: 'Please Verify your account, first!' });
    }

    const dataValues = await articles.createNewArticle(req);

    const {
      slug,
      title,
      description,
      body,
      tagList,
      author,
      updatedAt,
      createdAt,
      readtime,
      views
    } = dataValues;
    const userInfo = await findUser(author.username);
    eventEmitter.emit('publishArticle', userInfo.id, slug);
    const result = {
      // eslint-disable-next-line max-len
      slug,
      title,
      description,
      body,
      tagList,
      updatedAt,
      createdAt,
      author,
      readtime,
      views
    };

    res.status(201).send({
      article: result
    });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns array of articles
   */
  static async getAllArticle(req, res) {
    const allArticle = await articles.getAllArticle();

    if (!allArticle[0]) {
      return res.status(404).send({ error: 'Whoops! No Articles found!' });
    }
    res.status(200).send({
      articles: allArticle
    });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns article object
   */
  static async getOneArticle(req, res) {
    const { slug } = req.params;

    // @check if the article's slug exist
    const result = await Article.findOne({ where: { slug } });
    if (result === null) { return res.status(404).send({ error: 'This Slug Not found!' }); }
    const oneArticle = await articles.getOneSlug(slug);
    await Article.update(
      {
        views: oneArticle.dataValues.views += 1,
      },
      { where: { slug } }
    );
    res.status(200).send({
      status: 200,
      article: oneArticle
    });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status and updated article object
   */
  static async updateArticle(req, res) {
    const { slug } = req.params;
    const {
      title, body, description, tagList
    } = req.body;

    let updatedSlug;
    if (tagList !== undefined) {
      updatedSlug = tagList.split(',');
    } else {
      updatedSlug = req.foundArticle.tagList;
    }

    // @Object containing the Updated Data
    const updateSlug = {
      title: title || req.foundArticle.title,
      body: body || req.foundArticle.body,
      description: description || req.foundArticle.description,
      tagList: updatedSlug
    };

    // @generate an updated new slug
    const newSlug = await articles.createSlug(updateSlug.title);
    const newReadTime = readTime(updateSlug.body);

    // @Updating the article's data in Database
    const updatedArticle = await Article.update(
      {
        slug: newSlug,
        title: updateSlug.title,
        body: updateSlug.body,
        description: updateSlug.description,
        tagList: updateSlug.tagList,
        readtime: newReadTime
      },
      { where: { slug }, returning: true }
    );


    // Uplooad article image
    if (req.files) {
      uploadImageWorker(req.files, updatedArticle[1][0].dataValues.id, 'article', null);
    }

    // @returning the response
    res.status(200).send({
      message: 'Article updated successfully',
      article: updateSlug
    });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status
   */
  static async deleteArticle(req, res) {
    const { slug } = req.params;

    // @delete an article in Database
    await Article.destroy({ where: { slug } });

    // @returning the response
    res.status(200).send({ message: 'Article deleted successfully!' });
  }

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
  static async likeArticle(req, res) {
    const { id: currentUser } = req.user;
    const { slug } = req.params;

    try {
      // Find the article
      const query = await Article.findAll({ where: { slug } });

      if (!query[0]) {
        return res
          .status(404)
          .json({ message: `Article with slug: ${slug} not found` });
      }

      const { dataValues: foundArticle } = query[0];

      // Check the current user has not liked or disliked this article before
      const hasLiked = await LikeDislike.findAll({
        where: {
          articleId: foundArticle.id,
          userId: currentUser,
          likes: 1
        }
      });
      const hasDisliked = await LikeDislike.findAll({
        where: {
          articleId: foundArticle.id,
          userId: currentUser,
          dislikes: 1
        }
      });

      // If the user has already liked send a response
      if (hasLiked[0]) {
        return res.status(403).json({
          message: `User ${currentUser} has already liked article: ${slug}`
        });
      }

      // If user has disliked before, remove dislike, add like.
      if (hasDisliked[0]) {
        await LikeDislike.update(
          { dislikes: 0, likes: 1 },
          { where: { id: hasDisliked[0].id } }
        );
        return res
          .status(200)
          .json({ message: `User ${currentUser} has liked article ${slug}` });
      }

      // the user hasn't liked or disliked before, create new like
      await LikeDislike.create({
        userId: currentUser,
        articleId: foundArticle.id,
        dislikes: 0,
        likes: 1
      });

      return res
        .status(200)
        .json({ message: `User ${currentUser} has liked article ${slug}` });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status
   */
  static async dislikeArticle(req, res) {
    const { id: currentUser } = req.user;
    const { slug } = req.params;

    try {
      // Find the article
      const query = await Article.findAll({ where: { slug } });

      if (!query[0]) {
        return res
          .status(404)
          .json({ message: `Article with slug: ${slug} not found` });
      }

      const { dataValues: foundArticle } = query[0];

      // Check the current user has not liked or disliked this article before
      const hasLiked = await LikeDislike.findAll({
        where: {
          articleId: foundArticle.id,
          userId: currentUser,
          likes: 1
        }
      });
      const hasDisliked = await LikeDislike.findAll({
        where: {
          articleId: foundArticle.id,
          userId: currentUser,
          dislikes: 1
        }
      });

      // If the user has already disliked send a response
      if (hasDisliked[0]) {
        return res.status(403).json({
          message: `User ${currentUser} has already disliked article: ${slug}`
        });
      }

      // If user has liked before, remove like, add dislike.
      if (hasLiked[0]) {
        await LikeDislike.update(
          { dislikes: 1, likes: 0 },
          { where: { id: hasLiked[0].id } }
        );
        return res.status(200).json({
          message: `User ${currentUser} has disliked article ${slug}`
        });
      }

      // the user hasn't disliked before, create new dislike
      await LikeDislike.create({
        userId: currentUser,
        articleId: foundArticle.id,
        dislikes: 1,
        likes: 0
      });

      return res
        .status(200)
        .json({ message: `User ${currentUser} has disliked article ${slug}` });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status
   */
  static async getLikes(req, res) {
    const { slug } = req.params;

    // Find the article
    const query = await Article.findAll({ where: { slug } });

    if (!query[0]) {
      return res
        .status(404)
        .json({ message: `Article with slug: ${slug} not found` });
    }

    const { dataValues: foundArticle } = query[0];

    // Get likes
    const likeCount = await LikeDislike.count({
      where: { articleId: foundArticle.id, likes: 1 }
    });

    return res.status(200).json({
      status: 200,
      data: {
        articleSlug: slug,
        numberOfLikes: likeCount
      }
    });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a message with operation status
   */
  static async getDislikes(req, res) {
    const { slug } = req.params;

    // Find the article
    const query = await Article.findAll({ where: { slug } });

    if (!query[0]) {
      return res
        .status(404)
        .json({ message: `Article with slug: ${slug} not found` });
    }

    const { dataValues: foundArticle } = query[0];

    // Get likes
    const likeCount = await LikeDislike.count({
      where: {
        articleId: foundArticle.id,
        dislikes: 1
      }
    });

    return res.status(200).json({
      status: 200,
      data: {
        articleSlug: slug,
        numberOfDislikes: likeCount
      }
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
    return res.status(200).json({ status: 200, data: reportedArticles });
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
    *  @param {object} req
    * @param {object} res
    * @returns {object} Object representing the response returned
   */

  // eslint-disable-next-line require-jsdoc
  static async share(req, res) {
    const { slug, provider } = req.share;
    const { id } = req.user;
    await Share.create({
      userId: id,
      slug,
      provider
    });
    return res.status(200).json({
      message: 'Thanks for sharing!',
      article: req.article
    });
  }
}

export default articlesController;
