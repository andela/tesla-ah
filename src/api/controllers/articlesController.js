/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
/* eslint-disable no-console */
import articles from '../helpers/articlesHelper';

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
    const dataValues = await articles.createNewArticle(req);
    const {
      slug,
      title,
      description,
      body,
      tagList,
      author,
      updatedAt,
      createdAt
    } = dataValues;

    const result = {
      slug,
      title,
      description,
      body,
      tagList,
      updatedAt,
      createdAt,
      author
    };
    res.status(201).send({
      article: result
    });
  }

  static async getAllArticle(req, res) {
    const allArticle = await articles.getAllArticle();
    res.status(200).send({
      articles: allArticle
    });
  }

  static async getOneArticle(req, res) {
    const { slug } = req.params;
    const oneArticle = await articles.getOneSlug(slug);
    res.status(200).send({
      article: oneArticle
    });
  }
}
export default articlesController;
