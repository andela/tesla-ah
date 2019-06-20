import Joi from '@hapi/joi';
import _ from 'lodash';
import Schemas from '../helpers/validationSchemas';

const validateBody = schema => (req, res, next) => {
  const data = req.body;

  if (_.has(Schemas, schema)) {
    const chosenSchema = _.get(Schemas, schema);
    const validationResult = Joi.validate(data, chosenSchema, { abortEarly: false });

    if (!validationResult.error) {
      req.body = data;
      next();
    } else {
      const allErrors = [];
      validationResult.error.details.forEach((errors) => {
        const findError = allErrors.filter(error => error === errors.context.label);
        if (findError.length === 0) {
          allErrors.push(errors.context.label);
        }
      });
      return res.status(400).send({
        status: 400,
        data: { message: allErrors },
      });
    }
  }
};

export default validateBody;
