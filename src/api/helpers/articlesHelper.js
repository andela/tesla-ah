/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import slug from 'slug';
import uniqid from 'uniqid';
import models from '../../sequelize/models';

const { article, User } = models;

/**
 * @description Helpers for articles
 */
class ArticlesHelper {
  /**
   * @param {title}
   * @returns {newSlug}  return a new slug
   */
  static createSlug(title) {
    const newSlug = `${slug(title, { lower: true })}-${uniqid.process()}`;
    return newSlug;
  }

  static async createNewArticle(req) {
    /**
     * @param {object} req - Request.
     * @param {object} res - Response.
     * @returns {object} - Contains an article information.
     */
    const {
      title, body, description, tagList
    } = req.body;
    const { id } = req.user;
    const newSlug = this.createSlug(title);
    const { dataValues } = await article.create({
      slug: newSlug,
      title,
      description,
      body,
      tagList: tagList.split(','),
      authorid: parseInt(id, 10)
    });
    const userInfo = await this.getUserInfo(id);
    const { username, bio, image } = userInfo;
    const author = { username, bio, image };
    dataValues.author = author;
    return dataValues;
  }

  static async getUserInfo(id) {
    const { dataValues } = await User.findOne({ where: { id } });
    return dataValues;
  }

  static async getAllArticle() {
    const result = await article.findAll({
      include: [{
        as: 'author',
        model: User,
        attributes: ['username', 'bio', 'image']
      }],
      attributes: ['slug', 'title', 'description', 'body', 'tagList', 'updatedAt', 'createdAt']
    });
    return result;
  }

  static async getOneSlug(newSlug) {
    const result = await article.findOne({
      where: { slug: newSlug },
      include: [{
        as: 'author',
        model: User,
        attributes: ['username', 'bio', 'image']
      }],
      attributes: ['slug', 'title', 'description', 'body', 'tagList', 'updatedAt', 'createdAt']
    });
    return result;
  }
}
export default ArticlesHelper;
