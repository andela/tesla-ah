import dotenv from 'dotenv';
import notify from './Notify';
import db from '../../sequelize/models';

const { User, follows } = db;

dotenv.config();

export default async (authorId, slug) => {
  try {
    const author = await User.findOne({
      where: {
        id: authorId
      }
    });
    const url = `/articles/${slug}`;
    const followers = await follows.findAll({
      where: {
        userId: authorId
      }
    });
    followers.map(async (follower) => {
      await User.findOne({
        where: {
          id: follower.dataValues.followerId
        }
      });
      const inAppMessage = `${author.dataValues.firstName} ${author.dataValues.lastName} published a new article.`;
      const emailMessage = `${author.dataValues.firstName} ${author.dataValues.lastName} published a new article.
        <a href="${process.env.FRONTEND_URL}${url}">Click here to read the article!</a> `;
      const data = {
        resource: 'articles',
        action: 'publish',
        user: follower.dataValues,
        inAppMessage,
        emailMessage,
        url
      };
      const res = await notify(data);
      return res;
    });
  } catch (error) {
    return {
      errors: error
    };
  }
};
