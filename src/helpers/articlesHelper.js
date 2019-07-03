/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import slug from 'slug';
import uniqid from 'uniqid';
import models from '../sequelize/models';
import readTime from './ReadTime.helper';

const { Article, User } = models;

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

  /**
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @returns {object} - Contains an article information.
   */
  static async createNewArticle(req) {
    const {
      title, body, description, tagList
    } = req.body;
    const { id } = req.user;
    const newSlug = this.createSlug(title);
    const readtime = readTime(body);
    const { dataValues } = await Article.create({
      slug: newSlug,
      title,
      description,
      body,
      tagList: tagList.split(','),
      authorId: parseInt(id, 10),
      readtime,
      views: 0,
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
    const result = await Article.findAll(
      { where: { blocked: false } },
      {
        include: [{
          as: 'author',
          model: User,
          attributes: ['username', 'bio', 'image']
        }],
        attributes: ['id', 'slug', 'title', 'description', 'readtime', 'body', 'tagList', 'updatedAt', 'createdAt'],
        limit: 10
      }
    );
    return result;
  }

  static async getOneSlug(newSlug) {
    const result = await Article.findOne({
      where: { slug: newSlug },
      include: [{
        as: 'author',
        model: User,
        attributes: ['username', 'bio', 'image']
      }],
      attributes: ['slug', 'title', 'description', 'readtime', 'body', 'tagList', 'views', 'updatedAt', 'createdAt']
    });
    return result;
  }
}
export default ArticlesHelper;
