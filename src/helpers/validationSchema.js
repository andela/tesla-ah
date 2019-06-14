/* eslint-disable require-jsdoc */
import Joi from 'joi';
/**
 * @description - validating the request
 */
class validations {
  static createValidations(data) {
    const schema = {
      title: Joi.string().required(),
      body: Joi.string().required(),
      description: Joi.string().required(),
      tagList: Joi.string()
    };
    return Joi.validate(data, schema);
  }

  static updateValidations(updatedData) {
    const schema = {
      title: Joi.string(),
      body: Joi.string(),
      description: Joi.string(),
      tagList: Joi.string()
    };
    return Joi.validate(updatedData, schema);
  }
}
export default validations;
