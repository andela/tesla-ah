import db from '../../sequelize/models';

const { Share } = db;

const shareCount = async (slug, provider) => {
  const count = await Share.count({
    where: {
      slug,
      provider
    }
  });
  return count;
};

export default shareCount;
