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

const forgetPasswordVerifyValidate = Joi.object({
  email: Joi.string().email().required(),
  code:Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).max(20).required()
})

const corpRegisterValidate = Joi.object({
  corpName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  gstin: Joi.string().required()

})

module.exports = {
  userValidate,
  loginValidate,
  forgotPasswordValidate,
  forgetPasswordVerifyValidate,
  corpRegisterValidate
};