import open from 'open';
import dotenv from 'dotenv';
import share from 'social-share';
import db from '../sequelize/models';

dotenv.config();
const { Article } = db;
const { APP_URL_FRONTEND } = process.env;

export default async (req, res, next) => {
  const { slug } = req.params;
  const { title } = await Article.findOne({ where: { slug } });
  if (req.url.search(/\/twitter/g) > 0) {
    const url = share('twitter', { url: `${APP_URL_FRONTEND}/api/articles/${slug}` });
    await open(`${url}`, { wait: false });
  } else if (req.url.search(/\/facebook/g) > 0) {
    const url = share('facebook', { url: `${APP_URL_FRONTEND}/api/articles/${slug}` });
    await open(`${url}`, { wait: false });
  } else if (req.url.search(/\/email/g) > 0) {
    await open(
      `mailto:?subject=${title}&body=${APP_URL_FRONTEND}/articles/${slug}`,
      {
        wait: false
      }
    );
  }

  next();
};
