import Joi from '@hapi/joi';

const password = Joi.string()
  .trim()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
  .required()
  .label('Password is required and must be at least 8 letters containing'
  + ' at least a number a Lowercase letter and an Uppercase letter');
const email = Joi.string()
  .trim()
  .lowercase()
  .email()
  .required()
  .label('Email is required and should look like this : example@email.com!');

export default {
  passwordReset: Joi.object().keys({
    email
  }),
  applyPassword: Joi.object().keys({
    newpassword: password
  }),
  login: Joi.object().keys({
    email: Joi.string()
      .trim()
      .lowercase()
      .required()
      .min(3)
      .label('Username or email are required, they must have at least 3 letters'),
    password
  }),
  signup: Joi.object().keys({
    firstName: Joi.string()
      .trim()
      .required()
      .regex(/^[A-Za-z_-]+$/)
      .min(3)
      .label('First name is required, it must have at least 3 letters and must contain only letters, underscores(_) and hyphens (-)'),
    lastName: Joi.string()
      .trim()
      .required()
      .regex(/^[A-Za-z_.-]+$/)
      .min(3)
      .label('Last name is required, it must have at least 3 letters and must contain only letters, underscores(_) and hyphens (-)'),
    username: Joi.string()
      .trim()
      .lowercase()
      .required()
      .regex(/^[a-zA-Z0-9_.-]+$/)
      .min(3)
      .label('Username is required, it must have at least 3 letters and must contain only letters, numbers, underscores(_), hyphens (-) and points (.)'),
    email,
    password,
    confirmPassword: Joi.any()
      .required()
      .valid(Joi.ref('password'))
      .label('Password and Confirm Password do not match'),
    bio: Joi.string(),
    image: Joi.string(),
    dateOfBirth: Joi.string(),
    gender: Joi.string(),
    socialId: Joi.string(),
    provider: Joi.string()
  }),
  updateUser: Joi.object().keys({
    firstName: Joi.string()
      .trim()
      .regex(/^[A-Za-z_-]+$/)
      .min(3)
      .label('First name should have at least 3 letters and must contain only letters, underscores(_) and hyphens (-)'),
    lastName: Joi.string()
      .trim()
      .regex(/^[A-Za-z_.-]+$/)
      .min(3)
      .label('Last name should have at least 3 letters and must contain only letters, underscores(_) and hyphens (-)'),
    username: Joi.string()
      .trim()
      .lowercase()
      .regex(/^[a-zA-Z0-9_.-]+$/)
      .min(3)
      .label('Username should have at least 3 letters and must contain only letters, numbers, underscores(_), hyphens (-) and points (.)'),
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .label('Email should look like this : example@email.com!'),
    bio: Joi.string(),
    image: Joi.string(),
    dateOfBirth: Joi.string(),
    gender: Joi.string(),
    socialId: Joi.string(),
    provider: Joi.string()
  }),
  createArticle: Joi.object().keys({
    title: Joi.string()
      .required()
      .label('title is required and should be a string'),
    body: Joi.string()
      .required()
      .label('body is required and should be a string'),
    description: Joi.string()
      .required()
      .label('description is required and should be a string'),
    tagList: Joi.string()
  }),
  updateArticle: Joi.object().keys({
    title: Joi.string().label('title should be a string'),
    body: Joi.string().label('body should be a string'),
    description: Joi.string().label('description should be a string'),
    tagList: Joi.string()
  }),
  checkComment: Joi.object().keys({
    comment: Joi.string()
      .trim()
      .required()
      .min(3)
      .label('The comment is required and should have at least 3 letters!')
  }),
  checkDescription: Joi.object().keys({
    description: Joi.string()
      .trim()
      .required()
      .min(3)
      .label('Description is required and should have at least 3 letters!')
  }),
  validateRating: Joi.object().keys({
    rating: Joi.number()
      .integer()
      .positive()
      .min(1)
      .max(5)
      .required()
      .label('Rating must be from 1 to 5 ')
  }),
  validateHighlight: Joi.object().keys({
    highlightText: Joi.string()
      .trim()
      .required()
      .label('The highlightText is required and should be a string'),
    comment: Joi.string()
      .trim()
      .min(3)
      .label('The comment should have at least 3 letters!'),
    occurencyNumber: Joi.number()
      .label('Occurrency should be a number')


  }),
  validateTerms: Joi.object().keys({
    termsAndConditions: Joi.string()
      .trim()
      .min(10)
      .required()
      .label('Terms and Conditions are required are required and should at least have 10 letters')
  })
};
