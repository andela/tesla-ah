import db from '../../sequelize/models';
import hasLiked from '../../helpers/comment/hasLiked';

const { LikeDislike } = db;

const addCommentLike = async (req, res, next) => {
  const { commentId } = req.params;
  const { id, firstName } = req.user;
  const liked = await hasLiked(id, commentId);
  if (liked) {
    await LikeDislike.update({
      disliked: 0,
      likes: 1
    }, {
      where: {
        id: commentId
      }
    });

    return res.status(200).json({
      message: `Dear ${firstName}, Thank you for liking this comment!`
    });
  }

  next();
};

export default addCommentLike;
