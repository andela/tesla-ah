import open from 'open';
import dotenv from 'dotenv';
import share from 'social-share';
import db from '../sequelize/models';

dotenv.config();
const { Article, Highlights, User } = db;
const { APP_URL_FRONTEND } = process.env;

export default async (req, res, next) => {
  const { slug, highlightId } = req.params;
  const { title, authorId, gallery } = await Article.findOne({ where: { slug } });
  const { firstName, lastName } = await User.findOne({ where: { id: authorId } });
  const { highlightText } = await Highlights.findOne({ where: { id: highlightId } });
  if (gallery) {
    const image = gallery[0];
    if (req.url.search(/\/twitter/g) > 0) {
      const url = share('twitter', {
        url: `${APP_URL_FRONTEND}/api/articles/${slug}`,
        title: `${highlightText} - written by ${firstName} ${lastName} ${gallery[0]}`
      });
      await open(`${url}`, `${title}`, { wait: false });
    } else if (req.url.search(/\/facebook/g) > 0) {
      const url = share('facebook', {
        url: `${APP_URL_FRONTEND}/api/articles/${slug}`,
        title: `${highlightText} - written by ${firstName} ${lastName} ${image}`
      });
      await open(`${url}`, `${title}`, { wait: false });
    } else if (req.url.search(/\/email/g) > 0) {
      const highTitle = `${highlightText} - written by ${firstName} ${lastName} ${image}`;
      await open(
        `mailto:?subject=${title}&body=${highTitle} ${APP_URL_FRONTEND}/articles/${slug}`,
        {
          wait: false
        }
      );
    }
  }
  next();
};
