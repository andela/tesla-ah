import isBlocked from '../helpers/article/isBlocked';

const notblocked = async (req, res, next) => {
  const { article } = req;
  if (!isBlocked(article.id)) {
    return res.status(400).send({
      status: 400,
      error: 'The article you are trying to unblock is not blocked.'
    });
  }
  next();
};

export default notblocked;
