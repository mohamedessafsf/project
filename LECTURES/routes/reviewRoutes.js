const express = require('express');

const router = express.Router({mergeParams: true});

const 
{
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    setProductIdToBody,
    createFilterObject,
} = require('../services/reviewServices');

const 
{
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const authService = require('../services/authServices');

//-----------------------------------------------------------


router.route('/')
.get(createFilterObject, getAllReviews)
.post
(
    authService.protect,
    authService.allowedTo('user'),
    setProductIdToBody,
    createReviewValidator,
    createReview,
);

router.route('/:id')
.get(getReviewValidator, getReview)
.put
(
    authService.protect,
    authService.allowedTo('user'),
    updateReviewValidator,
    updateReview,
)
.delete
(
    authService.protect,
    authService.allowedTo('user', 'manger', 'admin'),
    deleteReviewValidator,
    deleteReview,
);


module.exports = router;