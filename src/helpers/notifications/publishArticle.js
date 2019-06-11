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
    const url = `${process.env.BASE_URL}/api/articles/${slug}`;
    const followers = await follows.findAll({
      where: {
        userId: authorId
      }
    });
    followers.map(async (follower) => {
      const user = await User.findOne({
        where: {
          id: follower.dataValues.followerId
        }
      });
      const inAppMessage = `Hello ${user.dataValues.firstName}, ${author.dataValues.firstName} ${author.dataValues.lastName} published a new article`;
      const emailMessage = `Hello ${user.dataValues.firstName}, ${author.dataValues.firstName} ${author.dataValues.lastName} published a new article<br>
        <br>
        <a href='${url}'>Read an article</a> `;
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
