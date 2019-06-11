import models from '../../sequelize/models';
import updateLike from '../../helpers/article/updateLike';
import hasDisliked from '../../helpers/article/hasDisliked';
import likesCount from '../../helpers/article/countLikes';

const { LikeDislike } = models;
/**
 * @class
 */
class ArticleLikes {
  /**
  * @param  {object} req
  * @param  {object} res
  * @return {object} returns a message with operation status
  */
  static async likeArticle(req, res) {
    const { id: currentUser } = req.user;
    const { slug } = req.params;

    try {
      const foundArticle = req.article;

      // If user has disliked before, remove dislike, add like.
      const { id } = hasDisliked(foundArticle.id, currentUser);
      if (id) {
        await updateLike(id);
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
  static async getLikes(req, res) {
    const { slug } = req.params;
    const foundArticle = req.article;

    return res.status(200).json({
      status: 200,
      data: {
        articleSlug: slug,
        numberOfLikes: likesCount(foundArticle.id)
      }
    });
  }
}

export default ArticleLikes;
