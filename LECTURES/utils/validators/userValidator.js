const {check} = require('express-validator');

const slugify = require('slugify');

const bcrypt = require('bcryptjs');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const UserModel = require('../../models/userModel');

exports.createUserValidator = 
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
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email address')
    .custom(  async (val, {req}) => {
        const userEmail = await UserModel.findOne({email: val})
        if(userEmail) {
             throw new Error('email is already used');
        };
        return true;
    })
    ,
    check('phone')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('only mobile phone allowed')
    .custom(  async (val, {req}) => {
        const userPhone = await UserModel.findOne({phone: val})
        if(userPhone) {
            throw new Error ('phone is already used'); 
        };
        return true;
    })
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

exports.updateUserValidator = 
[

    check('name')
    .optional()
    .isLength({min: 2})
    .withMessage('name at least 2 chars')
    .isLength({max: 32})
    .withMessage('maximum 32 chras of name')
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    })
    ,
    check('email')
    .optional()
    .isEmail()
    .withMessage('only email allowed')
    .custom(async(val, {req}) => {

        const userEmail = await UserModel.findById(req.params.id);
        if(userEmail) {
            throw new Error ('this email is already used');
        };
        return true;
    })
    ,
    check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('only Egyptian and Saudi Arabian numbers are allowed')
    .custom( async (val, {req}) => {

        const userPhone = await UserModel.findById(req.params.id);
        if(userPhone) {
            throw new Error ('this phone is already used');
        };
        return true;
    })
    ,
    validatorMiddleware
];

exports.getOneUserValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('check mongo id')
    ,
    validatorMiddleware
];

exports.deleteUserValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('check mongo id')
    ,
    validatorMiddleware
];

exports.changeUserPasswordValidator = 
[
    check('currentPassword')
    .notEmpty()
    .withMessage('current password is required')
    ,
    check('passwordConfirm')
    .notEmpty()
    .withMessage('password confirm is required')
    ,
    check('password')
    .notEmpty()
    .withMessage('password is reqiured')
    .custom(async (val, {req}) => {


        // check current password
        const verifyPass = await UserModel.findById(req.params.id);
        if(!verifyPass) {

            throw new Error ('Invalid id, check id and try again');
        };
        const compare = await bcrypt.compare(req.body.currentPassword, verifyPass.password);
        
        if(!compare) {
            throw new Error('Invalid current password, check password');
        };
        //-------------------------------------------------

        if(val !== req.body.passwordConfirm) {
            throw new Error ('password must match password confirm');
        };
        return true;
    })
    ,
    validatorMiddleware
];



