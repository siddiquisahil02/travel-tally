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
  gstin: Joi.string().required(),
  altPhone : Joi.string().optional()
})

const driverRegisterValidate = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().length(10).required(),
  aadhar: Joi.string().optional(),
  license: Joi.string().optional(),
  address: Joi.string().required(),
  joiningDate: Joi.date().required()
})

const vehicleRegisterValidate = Joi.object({
  model: Joi.string().required(),
  color: Joi.string().required(),
  year: Joi.string().length(4).required(),
  registrationNumber: Joi.string().required(),
  totalKms : Joi.number().required(),
  mileage: Joi.number().optional()
})

module.exports = {
  userValidate,
  loginValidate,
  forgotPasswordValidate,
  forgetPasswordVerifyValidate,
  corpRegisterValidate,
  driverRegisterValidate,
  vehicleRegisterValidate
};