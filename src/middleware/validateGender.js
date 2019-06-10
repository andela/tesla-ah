const validategender = (req, res, next) => {
  const { gender } = req.body;
  if (gender) {
    if (gender === 'M' || gender === 'F') {
      next();
    } else {
      res.status(400).json({
        status: 400,
        error: 'Gender should be represented by either "M" or "F" '
      });
    }
  } else {
    next();
  }
};

export default validategender;
