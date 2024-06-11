const crypto = require('crypto');

const asyncHandler = require('express-async-handler');

const UserModel = require('../models/userModel');

const ApiError = require('../utils/apiError');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const sendEmail = require('../utils/sendEmail');

const createToken = require('../utils/createToken');

//-------------------------------------------------------



// @desc        Signup
// @route       POST /api/v1/auth/signup
// @access      Public

exports.signup = asyncHandler( async (req, res, next) => {
    
    // 1 - Create user
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    // 2 - Generate token
    const token = createToken(user._id);
    res.status(201).json({ data: user, token});
});


// @desc    Login
// @route   POST /api/v1/auth/login
// @access  public

exports.login = asyncHandler( async (req, res, next) => {

    // 1- check if the email and password in body (validation)
    // 2- check if user is exist in database and the password is correct
    const user = await UserModel.findOne({email: req.body.email});
    const compare = await bcrypt.compare(req.body.password, user.password);
     
    if(!user || !compare) {
        return next(new ApiError ('incorrect email or password', 404));
    };
        
    // 3- need to generate token
    const token = createToken(user._id)
    // 4- send response
    res.status(200).json({data: user, token})

}); 

// @desc    protect
// @route   POST /api/v1/auth/protect
// @access  private


exports.protect = asyncHandler( async (req, res, next) => {

    // 1- check if token exist, if exist get it
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };

    if(!token) {
        return next(new ApiError ('must login to get access', 401));
    };

    // 2- verify token (no change happenes, expire token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // 3- check if user exists in db
    const currentUser = await UserModel.findById(decoded.userId);
    if(!currentUser) {
        return next( ApiError('the user is no longer available', 401));
    };

    // 4- check if user changed his password after token is created  

    if(currentUser.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        if(passwordChangedTimestamp > decoded.iat) {
            return next( new ApiError('password changed, need to login again', 401));
        };
    };  
    req.user = currentUser;
    next();
}); 


// Authorization (user permissions)

exports.allowedTo = (...roles) => asyncHandler( async (req, res, next) => {
    
    // 1- need to access roles
    // 2- need to access user
    if(!roles.includes(req.user.role)) {
        return next( new ApiError ('this user is not allowed to access', 403));
    };
    next(); 


});



// @desc    forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  public

exports.forgotPassword = asyncHandler( async (req, res, next) => {

    // 1- get user by email

    const user = await UserModel.findOne({email: req.body.email});
    if(!user) {
        return next( new ApiError (`no user for this email: ${req.body.email}`, 404));
    };
    
    // 2- if user exist, generate random 6 digits, then save them in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
    .createHash('sha256')  
    .update(resetCode)
    .digest('hex');

    console.log(resetCode);
    console.log(hashedResetCode);
    user.passwordResetCode = hashedResetCode;
    user.passwordResetCodeExpire = Date.now() + 10 * 60 * 1000;
    user.passwordResetCodeVerified = false;
    await user.save();
    // 3- send the reset code to email

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 minutes)',
            message: `we reveived a request to reset your password \n reset code: ${resetCode}`,
        });
    
    }catch(err) {
        user.passwordresetCode = undefined;    
        user.passwordresetCodeExpire = undefined;    
        user.passwordResetCodeVerified = undefined;    
        await save()
        return next(new ApiError ('there is an error with sending email', 500))
    }
    res.status(200).json({status: 'success', message: 'reset code sent to email'});
});

// @desc    verify reset password code
// @route   POST /api/v1/auth/verifyresetpasswordcode
// @access  public

exports.verifyResetPasswordCode = asyncHandler( async (req, res, next) => {

    // 1) get user based on reset code
    const hashedResetCode = crypto
    .createHash('sha256')  
    .update(req.body.resetCode)
    .digest('hex');

    const user = await UserModel.findOne(
        {
            passwordResetCode: hashedResetCode,
            passwordResetCodeExpire: {$gt: Date.now()}
        });
        if(!user) {
            return next( new ApiError ('invalid or expired reset code', 401))
        }
        // 2) if reset code valid 
        user.passwordResetCodeVerified = true;
        await user.save();
        res.status(200).json({msg: 'reset code is verified'});


});


// @desc    reset password
// @route   POST /api/v1/auth/resetpassword
// @access  public

exports.resetPassword = asyncHandler( async (req, res, next) => {


    // 1) get user based on email
    const user = await UserModel.findOne({email: req.body.email});
    if(!user) {
       return next(new ApiError (`invalid email: ${req.body.email}`, 404));
    };

    // 2) check if user code is verified
    if(!user.passwordResetCodeVerified) {
        return next( new ApiError (`ivalid reset code`, 401));
    };

    // 3) save new updated
    const newPassword = user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpire = undefined;
    user.passwordResetCodeVerified = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    
    // 4) generate new token
    const token = createToken(user._id);
    res.status(200).json({msg: `password updated successfully`, data: user.password, token})
});









