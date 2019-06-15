import joi from 'joi';

export default {
  passwordResetShema: joi.object().keys({
    email: joi.string().email().required(),
  }),
  applyPasswordShema: joi.object().keys({
    newpassword: joi.string().regex(/^[a-zA-Z]/).min(8).required(),
  })
};
