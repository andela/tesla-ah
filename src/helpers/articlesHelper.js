/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import slug from 'slug';
import uniqid from 'uniqid';
import models from '../sequelize/models';
import readTime from './ReadTime.helper';
import workers from '../workers';

const { Article, User } = models;
const { uploadImageWorker } = workers;

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
      authorId: id,
      readtime,
      views: 0,
    });

    // Uplooad article image
    if (req.files) {
      uploadImageWorker(req.files, dataValues.id, 'article', null);
    }

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
          attributes: ['username', 'bio', 'avatar']
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
        attributes: ['username', 'bio', 'avatar']
      }],
      attributes: ['slug', 'title', 'description', 'readtime', 'body', 'tagList', 'views', 'updatedAt', 'createdAt']
    });
    return result;
  }
}
export default ArticlesHelper;
