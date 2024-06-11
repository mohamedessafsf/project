const {check, body} = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// eslint-disable-next-line import/order
const slugify = require('slugify');

//----------------------------------------------------------------

exports.getSubCategoryValidator = 
[    
check('id')
.isMongoId()
.withMessage('Invalid ID'), 
validatorMiddleware
];

exports.createSubCategoryValidator = 
[
check('name')
.notEmpty()
.withMessage('Name is Required')
.isLength({min: 2})
.withMessage('Name must be at least 3 Chars')
.isLength({max: 32})
.withMessage('Too long subCategory name')
.custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
})
,
check('category')
.notEmpty()
.withMessage('Category is Required')
.isMongoId()
.withMessage('Invalid category id')
,
validatorMiddleware
];

exports.updateSubCategoryValidator = 
[
check('id')
.isMongoId()
.withMessage('Invalid ID')
,
body('name')
.custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
})
, 
validatorMiddleware
];

exports.deleteSubCategoryValidator = 
[
    check('id')
.isMongoId()
.withMessage('Invalid ID'), 
validatorMiddleware
];

