import db from '../../sequelize/models';
import favouritedBy from '../Favourites';
import notify from './NotifyForBookmarks';

const { User, Bookmarks } = db;

const commentArticle = async (comment) => {
  try {
    const author = await User.findOne({
      where: {
        id: comment.userId
      }
    });
    const favourites = await Bookmarks.findAll({
      where: {
        slug: comment.slug,
      }
    });
    if (favourites) {
      favourites.map(async (fav) => {
        const user = await favouritedBy(fav.userId);
        const inAppMessage = `Dear ${user.firstName} ${user.lastName}, ${author.dataValues.lastName} commented on the article you bookmarked!
      `;
        const emailMessage = `
      Hello ${user.firstName}, ${author.lastName} commented on the article you bookmarked! <br>
      Please click below to read the comment: <br><br><br>
      <a href='${process.env.BASE_URL}/api/articles/${comment.slug}/comments'>View all comments</a>
      <br>
      `;

        const data = {
          resource: 'articles',
          action: 'comment',
          user,
          inAppMessage,
          emailMessage
        };
        const res = await notify(data);
        return res;
      });
    }
  } catch (err) {
    return {
      errors: err
    };
  }
};

export default commentArticle;
