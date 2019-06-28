/* eslint-disable no-prototype-builtins */
import sequelize from 'sequelize';
import models from '../sequelize/models';

const { Op } = sequelize;
const { User, Article } = models;
/**
 * @description search by different parameters
 */
class search {
  /**
   * @param {object} req - Request.
   * @param {object} res - Response.
   * @param {function} next - passing to other middlewares
   * @returns {object} - Contains an article information.
   */
  static async searchForArticle(req, res, next) {
    const {
      title, author, keywords, tag
    } = req.query;

    if (!Object.keys(req.query).length) {
      return next();
    }

    if (!title && !tag && !author && !keywords) {
      return res.status(400).send({ error: 'You made a Bad Request!' });
    }

    if (author && !keywords && !tag && !title) {
      // check if the author has a value and has at least three characters
      if (author.length < 3) return res.status(400).send({ error: 'You should have provided at least 3 characters long for author\'s name' });
      // @find the author
      const result = await User.findOne({
        where: { username: { [Op.iLike]: `%${author}%` } }
      });
      if (result === null) {
        return res.status(404).send({
          error: `This Author with username of ${author} not exists!`
        });
      }

      // @find All article written by the found Author
      const response = await Article.findAll({
        where: { authorId: result.dataValues.id },
        include: [
          {
            as: 'author',
            model: User,
            attributes: ['username', 'bio', 'image']
          }
        ],
        attributes: [
          'slug',
          'title',
          'description',
          'readtime',
          'body',
          'tagList',
          'updatedAt',
          'createdAt'
        ]
      });

      if (!response[0]) {
        return res.status(404).send({
          error: `Author : ${author} - doesn't have any article, so far!`
        });
      }

      // @returning the response
      return res.status(200).send({
        message: `Here's All article written by Author who is like ${author}`,
        data: response
      });
    }

    if (title && !author && !tag && !keywords) {
      // check if the title has at least three characters
      if (title.length < 3) return res.status(400).send({ error: 'You should have provided at least 3 characters long for title' });

      const titleFound = await Article.findAll({
        where: { title: { [Op.iLike]: `%${title}%` } },
        include: [
          {
            as: 'author',
            model: User,
            attributes: ['username', 'bio', 'image']
          }
        ],
        attributes: [
          'slug',
          'title',
          'description',
          'readtime',
          'body',
          'readtime',
          'tagList',
          'updatedAt',
          'createdAt'
        ]
      });
      if (!titleFound[0]) {
        return res.status(200).send({
          error: 'No Articles with that title, so far!'
        });
      }

      return res
        .status(200)
        .send({
          message: `Here's All Articles which has the same title like this ${title}`,
          data: titleFound
        });
    }

    if (!title && !author && tag && !keywords) {
      // check if the tag has at least three characters
      if (tag.length < 3) return res.status(400).send({ error: 'You should have provided at least 3 characters long for tag' });

      const tagFound = await Article.findAll({
        where: { tagList: { [Op.contains]: [tag.toLowerCase()] } },
        include: [
          {
            as: 'author',
            model: User,
            attributes: ['username', 'bio', 'image']
          }
        ],
        attributes: [
          'slug',
          'title',
          'description',
          'readtime',
          'body',
          'readtime',
          'tagList',
          'updatedAt',
          'createdAt'
        ]
      });
      if (!tagFound[0]) {
        return res.status(200).send({
          error: 'No Articles with that tag, so far!'
        });
      }

      return res
        .status(200)
        .send({
          message: `Here's All Articles which has the same tag like this ${tag}`,
          data: tagFound
        });
    }

    if (!title && !author && !tag && keywords) {
      // check if the keyword has at least three characters
      if (keywords.length < 3) return res.status(400).send({ error: 'You should have provided at least 3 characters long for keywords' });

      const keywordFound = await Article.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${keywords.toLowerCase()}%` } },
            { body: { [Op.iLike]: `%${keywords.toLowerCase()}%` } },
            { description: { [Op.iLike]: `%${keywords.toLowerCase()}%` } },
            { tagList: { [Op.contains]: [keywords.toLowerCase()] } }
          ]
        },
        attributes: [
          'slug',
          'title',
          'description',
          'readtime',
          'body',
          'readtime',
          'tagList',
          'updatedAt',
          'createdAt'
        ]
      });
      if (!keywordFound[0]) {
        return res.status(200).send({
          error: 'No Articles with that Keyword found, so far!'
        });
      }

      return res
        .status(200)
        .send({
          data: keywordFound
        });
    }
  }
}

export default search;
