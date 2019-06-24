import db from '../sequelize/models/index';

const { Highlights } = db;
const highlightExist = async (req, res, next) => {
  const {
    article, user: { id },
    body: { highlightText, occurencyNumber }
  } = req; // This contains the article
  const response = await Highlights.findOne({
    where: {
      articleId: article.id,
      userId: id,
      highlightText,
      occurencyNumber
    }
  });
  if (!response) {
    return next();
  }
  return res.status(403).json({
    Message: 'you have already highlighted this text.'
  });
};

export default highlightExist;
