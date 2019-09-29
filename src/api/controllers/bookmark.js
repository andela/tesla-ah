import db from '../../sequelize/models';

const { Bookmarks, Article } = db;
/**
* @author Diane Mahoro
* @class Bookmark
* @description this class performs the whole of rating
*/
class Bookmark {
  /**
  *
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} - Response object
  */
  static async bookmark(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const data = {
      slug,
      userId: id
    };
    const response = await Bookmarks.findAll({
      where: {
        slug,
        userId: id
      }
    });
    if (!response[0]) {
      const newBookmark = await Bookmarks.create({
        slug: data.slug,
        userId: data.userId
      });
      return res.status(201).json({
        data: newBookmark,
        message: 'Bookmark created'
      });
    }
    await Bookmarks.destroy({ where: { slug, userId: id }, logging: false });
    res.status(200).json({
      message: 'Bookmark deleted'
    });
  }

  /**
  *
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} - Response object
  */
  static async getOwnerBookmarks(req, res) {
    const { id } = req.user;
    const yourBookmarks = await Bookmarks.findAll({
      where: {
        userId: id
      },
      include: [{ model: Article, as: 'article' }]
    });
    res.status(200).json({
      data: yourBookmarks.map(bookmark => bookmark.get().article)
    });
  }

  /**
  *
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} - Response object
  */
  static async deleteBookmarks(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const response = await Bookmarks.findAll({
      where: {
        slug,
        userId: id
      }
    });
    if (response[0]) {
      await Bookmarks.destroy({ where: { slug, userId: id }, logging: false });
      return res.status(200).json({
        message: 'Bookmark deleted'
      });
    }
    res.status(404).json({
      error: 'Article Not found!'
    });
  }
}
export default Bookmark;
