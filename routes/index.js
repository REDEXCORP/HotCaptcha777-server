const express = require('express');
const router = express.Router();

const { userValidator, userOtpValidator, resetPasswordValidator, userLoginValidator, userForgotPasswordOtpValidator, userForgotPasswordValidator } = require('../validations/validators');
const validationResults = require('../middlewares/validationResult');
const authTokenValidator = require('../middlewares/authTokenValidator');
const authTokenAndUserIdValidator = require('../middlewares/authTokenAndUserIdValidator');

const userRegister = require('../controllers/userRegister');
const resetUserPassword = require('../controllers/resetUserPassword');
const userInfo = require('../controllers/userInfo');
const userLogin = require('../controllers/userLogin');
const userForgotPassword = require('../controllers/userForgotPassword');
const userOtp = require('../controllers/userOtp');


router.post('/user/register/otp', userOtpValidator, validationResults, userOtp);
router.post('/user/register', userValidator, validationResults, userRegister);
router.post('/user/login', userLoginValidator, validationResults, userLogin);
router.post('/user/forgot-password/otp', userForgotPasswordOtpValidator, validationResults, userOtp);
router.put('/user/forgot-password', userForgotPasswordValidator, validationResults, userForgotPassword);

router.get('/user/user-info', userValidator, authTokenValidator, userInfo);

router.put('/user/reset-password', resetPasswordValidator, validationResults, authTokenAndUserIdValidator, resetUserPassword);

module.exports = router;