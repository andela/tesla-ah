import validate from '../helpers/signupSchema';


const validateBody = (req, res, next) => {
  const data = req.body;
  const err = validate.signup(data);

  if (err.error === null) {
    req.body = data;
    next();
  } else {
    const allErrors = [];

    err.error.details.forEach((errors) => {
      allErrors.push(errors.context.label);
    });

    return res.status(400).send({
      message: allErrors,
    });
  }
};

export default validateBody;
