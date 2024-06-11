const {check, body} = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// eslint-disable-next-line import/order
const slugify = require('slugify');
//----------------------------------------------------------------

exports.getCategoryValidator = 
[    
check('id')
.isMongoId()
.withMessage('Invalid ID'), 
validatorMiddleware
];

exports.createCategoryValidator = 
[
check('name')
.notEmpty()
.withMessage('Name is required')
.isLength({min: 3})
.withMessage('Name must be at least 3 Chars')
.isLength({max: 32})
.withMessage('Too long Category name')
.custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
})
,
validatorMiddleware
];

exports.updateCategoryValidator = 
[
check('id')
.isMongoId()
.withMessage('Invalid ID'),
body('name')
.optional()
.custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
})
,
validatorMiddleware
];

exports.deleteCategoryValidator = 
[
    check('id')
.isMongoId()
.withMessage('Invalid ID'), 
validatorMiddleware
];

