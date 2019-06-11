

const deleteAllowed = async (req, res, next) => {
  const { id, roles } = req.user;
  const { userToDelete } = req;
  if (userToDelete === id || roles.includes('moderator' || 'admin')) {
    next();
  } else {
    res.status(403).json({
      error: 'You are not allowed to delete this comment'
    });
  }
};
export default deleteAllowed;
