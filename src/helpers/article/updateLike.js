import db from '../../sequelize/models';

const { LikeDislike } = db;

const updateLike = async (id) => {
  const res = await LikeDislike.update({
    likes: 1,
    dislikes: 0
  }, {
    where: {
      id
    }
  });
  return !!res;
};

export default updateLike;
