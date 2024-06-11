const {check} = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const ReviewModel = require('../../models/reviewModel');

//-------------------------------------------------

exports.createReviewValidator = 
[
    check('title')
    .optional()
    ,
    check('ratings')
    .notEmpty()
    .withMessage('rate is required')
    .isFloat({min: 1, max: 5})
    .withMessage('rating must be between 1 to 5')
    ,
    check('user')
    .isMongoId()
    .withMessage('check user id')
    ,
    check('product')
    .isMongoId()
    .withMessage('check product id')
    .custom( async (val, {req}) => {
        // checked if logged user rated before
        const review = await ReviewModel.findOne({user: req.user._id, product: req.body.product});
        if(review) {
            throw new Error ('you already have rated this product');
        }; 
        return true;
    })
    ,
    validatorMiddleware
];


exports.getReviewValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('check review id')
    ,
    validatorMiddleware
];


exports.updateReviewValidator = 
[
    check('id')   
    .isMongoId()
    .withMessage('check review id')
    .custom( async (val, {req}) => {
        const review = await ReviewModel.findById(val);
        if(!review) {
            throw new Error (`no review for this id: ${val}`);
        };
        
        if(review.user._id.toString() !== req.user._id.toString()) {
            throw new Error('this review is not belong to this user');
        };
        return true;
    })
    ,
    validatorMiddleware
];


exports.deleteReviewValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('check review id')
    .custom( async (val, {req}) => {

        if(req.user.role === 'manger' || req.user.role === 'admin') {
            return true;
        };
        
        if(req.user.role === 'user') {
        const review = await ReviewModel.findById(val);
        if(!review) {
            throw new Error (`no review for this id: ${val}`)
        };

        if(review.user._id.toString() !== req.user._id.toString()) {
            throw new Error (`this review is not belong for this user`)
        }
    }else {
        throw new Error ('must be a user to delete this review');
    };
        return true;
    })
    ,
    validatorMiddleware
];







