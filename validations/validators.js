const { body } = require('express-validator');

const userOtpValidator = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('type').notEmpty().withMessage('Please provide a valid type of OTP'),
];

const userValidator = [
  body('otp')
  .notEmpty().withMessage('OTP is required'),

  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name should only contain alphabets'),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name should only contain alphabets'),
  
  body('companyName')
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2 }).withMessage('Company name should be at least 2 characters long'),
  
  body('email')
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['recruiter', 'company']).withMessage('Role must be one of "recruiter", "company"'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[\W_]/).withMessage('Password must contain a special character'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  
  body('countryCode')
    .notEmpty().withMessage('Country is required')
];

const resetPasswordValidator = [
  body('password')
    .notEmpty()
    .withMessage('Please provide your current password'),

  body('newPassword')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[\W_]/).withMessage('Password must contain a special character')
    .custom((value, { req }) => value !== req.body.password).withMessage('New password cannot be the same as the current password'),
    
  body('confirmNewPassword')
    .notEmpty().withMessage('Confirm new password is required')
    .custom((value, { req }) => value === req.body.newPassword).withMessage('New password does not match with confirm new password'),
];

const userLoginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

const userForgotPasswordOtpValidator = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('type').notEmpty().withMessage('Please provide a valid type of OTP'),
];

const userForgotPasswordValidator = [
  body('email').isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[\W_]/).withMessage('Password must contain a special character'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),

  body('otp').notEmpty().withMessage('Please provide a valid type of OTP'),
];

module.exports = {
  userOtpValidator,
  userValidator,
  resetPasswordValidator,
  userLoginValidator,
  userForgotPasswordOtpValidator,
  userForgotPasswordValidator
};
