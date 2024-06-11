const {check, body} = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// eslint-disable-next-line import/order
const slugify = require('slugify');
//----------------------------------------------------------------

exports.createBrandValidator = 
[
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({min: 2})
    .withMessage('Name must be at least 2 characters')
    .isLength({max: 32})
    .withMessage('Maximum chars of name is 32')
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    })
    ,
    validatorMiddleware
];


exports.getSpecificBrandValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('Check brand ID')
    ,
    validatorMiddleware
];

exports.updateBrandValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('Check brand ID')
    ,
    check('name')
    .optional()
    ,
    body('name')
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    }).withMessage('Wrong with slugify'),
    validatorMiddleware
];

exports.deleteBrandValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('Check brand ID')
    ,
    validatorMiddleware
];





