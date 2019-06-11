
const created = (res, message = 'Created!', data = {}) => {
  res.status(201).json({
    message,
    data
  });
};

export default created;
