/* eslint-disable import/no-cycle */
import articles from '../../helpers/articlesHelper';
import models from '../../sequelize/models';
import readTime from '../../helpers/ReadTime.helper';
import eventEmitter from '../../helpers/notifications/EventEmitter';
import findUser from '../../helpers/FindUser';
import workers from '../../workers';


const { uploadImageWorker } = workers;


const {
  Article,
  Share
} = models;

/**
 * @Author - Audace Uhiriwe
 */
class ArticlesController {
  /**
   * creating a new article
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - returns created article
   */
  static async createArticle(req, res) {
    const dataValues = await articles.createNewArticle(req);
    const userInfo = await findUser(dataValues.author.username);
    eventEmitter.emit('publishArticle', userInfo.id, dataValues.slug);
    res.status(201).send({
      article: dataValues
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
      return res.status(200).send({ message: 'No articles yet!', data: allArticle });
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
    *  @param {object} req
    * @param {object} res
    * @returns {object} Object representing the response returned
   */
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

export default ArticlesController;
