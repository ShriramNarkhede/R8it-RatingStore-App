// backend/utils/validations.js
const Joi = require('joi');

// Validation for user registration
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(20).max(60).required()
      .messages({
        'string.min': 'Name must be at least 20 characters long',
        'string.max': 'Name cannot exceed 60 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$'))
      .required()
      .messages({
        'string.pattern.base': 'Password must be 8-16 chars, with at least one uppercase and one special character',
        'any.required': 'Password is required'
      }),
    address: Joi.string().max(400).required()
      .messages({
        'string.max': 'Address cannot exceed 400 characters',
        'any.required': 'Address is required'
      }),
    role: Joi.string().valid('admin', 'user', 'store-owner').default('user')
      .messages({
        'any.only': 'Role must be admin, user, or store-owner'
      })
  });
  return schema.validate(data);
};

// Validation for login
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

// Validation for store creation
const storeValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required()
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation, storeValidation };