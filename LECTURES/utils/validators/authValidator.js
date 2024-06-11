const {check} = require('express-validator');

const slugify = require('slugify');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const UserModel = require('../../models/userModel');

//------------------------------------------


exports.signupValidator = 
[
    check('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min: 2})
    .withMessage('name at least 2 chars')
    .isLength({max: 32})
    .withMessage('maximum 32 chras of name')
    .custom((val, {req}) => {

        req.body.slug = slugify('name');
        return true
    })
    .withMessage('Wrong with slug')
    ,
    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min: 8})
    .withMessage('short password, at least 8 chars')
    .isLength({max: 20})
    .withMessage('too long password, maximum 20 chars')
    .custom((val, {req}) => {
        if(val !== req.body.passwordConfirm) {
            throw new Error ('password confirmation incorrect');
        }else   
        return true;
    })
    ,
    check('passwordConfirm')
    .notEmpty()
    .withMessage('password confirm is required')
    ,
    check('profileImage')
    .optional()
    ,
    check('role')
    .optional()
    ,
    validatorMiddleware
    
];

exports.loginValidator = 
[
    check('email')
    .notEmpty()
    .withMessage('email adress is required')
    .isEmail()
    .withMessage('check email adress and try again')
    ,
    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min: 8})
    .withMessage('invalid password, too short password')
    ,
    validatorMiddleware
];
 
