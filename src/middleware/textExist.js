
const textExist = async (req, res, next) => {
  const {
    article,
    body: { highlightText, occurencyNumber }
  } = req; // This contains the article


  const { body } = article;
  const regX = new RegExp(highlightText, 'g');
  const count = (body.match(regX) || []).length;
  if (count === 0 || occurencyNumber > count) {
    return res.status(404).json({
      Message: 'Highlight text not found'
    });
  }
  next();
};
export default textExist;
