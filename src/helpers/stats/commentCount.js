import db from '../../sequelize/models';

const { Comment } = db;

const commentCount = async (slug) => {
  const count = await Comment.count({
    where: {
      slug
    }
  });
  return count;
};

export default commentCount;
