const express = require('express');

const router = express.Router();

const
{
    signup,
    login,
    forgotPassword,
    verifyResetPasswordCode,
    resetPassword,
} = require('../services/authServices');

const
{
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');

//------------------------------------------------

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyresetpasswordcode', verifyResetPasswordCode);
router.put('/resetpassword', resetPassword);

module.exports = router;