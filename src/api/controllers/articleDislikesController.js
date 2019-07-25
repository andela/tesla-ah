import db from '../../sequelize/models';
import updateDislike from '../../helpers/article/updateDislike';
import hasLiked from '../../helpers/article/hasLiked';
import dislikesCount from '../../helpers/article/countDislikes';

const { LikeDislike } = db;
/**
 * @class
 */
class ArticleDislikes {
/**
 * @param  {object} req
 * @param  {object} res
 * @return {object} returns a message with operation status
 */
  static async dislikeArticle(req, res) {
    const { id: currentUser } = req.user;
    const { slug } = req.params;

    try {
      const foundArticle = req.article;

      // If user has liked before, remove like, add dislike.
      const { id } = hasLiked(foundArticle.id, currentUser);
      if (id) {
        updateDislike(id);
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
  static async getDislikes(req, res) {
    const { slug } = req.params;
    const foundArticle = req.article;

    return res.json({
      status: 200,
      data: {
        slug,
        dislikes: dislikesCount(foundArticle.id)
      }
    });
  }
}

export default ArticleDislikes;
