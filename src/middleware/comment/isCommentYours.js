

const isCommentYours = async (req, res, next) => {
  const { id } = req.user;
  const { userId } = req.comment;

  if (id !== userId) {
    return res.status(403).json({
      status: 403,
      error: 'You are not allowed to update this comment'
    });
  }
  next();
};

export default isCommentYours;
