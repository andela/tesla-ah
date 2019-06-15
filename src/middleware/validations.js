/* eslint-disable no-useless-escape */
/* eslint-disable require-jsdoc */
import validate from '../helpers/validationSchema';
/**
 * @description - Middleware for validating the request body
 */
class validations {
  static createValidations(req, res, next) {
    const { error } = validate.createValidations(req.body);

    // @check if there is an error in the request sent
    if (error) return res.status(400).send({ error: error.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g, '') });
    return next();
  }

  static updateValidations(req, res, next) {
    const { error } = validate.updateValidations(req.body);

    // @check if there is an error in the request sent
    if (error) return res.status(400).send({ error: error.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g, '') });
    return next();
  }
}
export default validations;
