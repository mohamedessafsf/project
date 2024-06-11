
const ReviewModel = require('../models/reviewModel');

const factory = require('./factoryhandler');

//----------------------------------------------------------

exports.setProductIdToBody = (req, res, next) => {

    if(!req.body.product) {
        req.body.product = req.params.productId;
    };

    if(!req.body.user) {
        req.body.user = req.user._id;
    };
    next();
};

exports.createFilterObject = (req, res, next) => {

    let filterObject = {};
    if(req.params.productId) {
        filterObject = {product: req.params.productId};
    };
    req.filterObj = filterObject;
    next();
};

// @desc    create a review
// @route   GET /api/v1/reviews
// @access  private/protect/user  

exports.createReview = factory.createOne(ReviewModel);


// @desc    get all reviews
// @route   GET /api/v1/reviews
// @access  public  

exports.getAllReviews = factory.getAll(ReviewModel);


// @desc    get one review
// @route   GET /api/v1/reviews/:id
// @access  public  

exports.getReview = factory.getOne(ReviewModel);

// @desc    update one review
// @route   PUT /api/v1/reviews/:id
// @access  private/protect/user  

exports.updateReview = factory.updateOne(ReviewModel);

// @desc    delete one review
// @route   DELETE /api/v1/reviews
// @access  private/protect/user-admin-manger  

exports.deleteReview = factory.deleteOne(ReviewModel);

