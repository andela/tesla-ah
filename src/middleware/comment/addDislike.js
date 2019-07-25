import db from '../../sequelize/models';
import hasDisliked from '../../helpers/comment/hasDisliked';

const { LikeDislike } = db;

const updateDislike = async (req, res, next) => {
  const { commentId } = req.params;
  const { id, firstName } = req.user;
  const disliked = await hasDisliked(id, commentId);

  if (disliked) {
    await LikeDislike.update({
      likes: 0,
      dislikes: 1
    }, {
      where: {
        id: commentId
      }
    });

    return res.status(200).json({
      message: `Dear ${firstName}, Thank you for disliking this comment!`
    });
  }

  next();
};

export default updateDislike;
