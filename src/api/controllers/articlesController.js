/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
/* eslint-disable no-console */
import articles from '../../helpers/articlesHelper';
import models from '../../sequelize/models';
import readTime from '../../helpers/ReadTime.helper';

const { article, User } = models;

/**
 * @Author - Audace Uhiriwe
 */
class articlesController {
  /**
   * creating a new article
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - Contains an article information.
   */
  static async createArticle(req, res) {
    const { id } = req.user;

    // @check if that user is verified
    const user = await User.findOne({ where: { id } });
    if (user.dataValues.verified === false) return res.status(403).send({ error: 'Please Verify your account, first!' });

    const dataValues = await articles.createNewArticle(req);
    const {
      slug, title, description, body, tagList, author, updatedAt, createdAt
    } = dataValues;

    const result = {
      slug, title, description, body, tagList, updatedAt, createdAt, author
    };
    res.status(201).send({
      article: result
    });
  }

  static async getAllArticle(req, res) {
    const allArticle = await articles.getAllArticle();
    if (!allArticle[0]) return res.status(404).send({ error: 'Whoops! No Articles found!' });
    res.status(200).send({
      articles: allArticle
    });
  }

  static async getOneArticle(req, res) {
    const { slug } = req.params;

    // @check if the article's slug exist
    const result = await article.findOne({ where: { slug } });
    if (result === null) return res.status(404).send({ error: 'This Slug Not found!' });

    const oneArticle = await articles.getOneSlug(slug);
    res.status(200).send({
      article: oneArticle,
      readtime: readTime(oneArticle.body)
    });
  }

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

    // @Updating the article's data in Database
    await article.update(
      {
        slug: newSlug,
        title: updateSlug.title,
        body: updateSlug.body,
        description: updateSlug.description,
        tagList: updateSlug.tagList
      },
      { where: { slug } }
    );

    // @returning the response
    res.status(200).send({
      message: 'Article updated successfully',
      article: updateSlug
    });
  }

  static async deleteArticle(req, res) {
    const { slug } = req.params;

    // @delete an article in Database
    await article.destroy({ where: { slug } });

    // @returning the response
    res.status(200).send({ message: 'Article deleted successfully!' });
  }
}
export default articlesController;
