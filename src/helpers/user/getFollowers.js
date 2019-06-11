import db from '../../sequelize/models';

const { follows, User } = db;

const getFollowers = async (userId) => {
  const data = await follows.findAll({
    where: {
      userId
    },
    include: [{
      model: User,
      as: 'follower',
      attributes: ['id', 'firstName', 'lastName', 'email', 'username']
    }]
  });

  return data;
};

export default getFollowers;
