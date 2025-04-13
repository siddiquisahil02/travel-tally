const Joi = require('joi');

const userValidate = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(13).required(),
});

const loginValidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

const forgotPasswordValidate = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  userValidate,
};