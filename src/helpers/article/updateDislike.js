import db from '../../sequelize/models';

const { LikeDislike } = db;

const updateDislike = async (id) => {
  await LikeDislike.update({
    likes: 0,
    dislikes: 1
  }, {
    where: {
      id
    }
  });
};

export default updateDislike;
