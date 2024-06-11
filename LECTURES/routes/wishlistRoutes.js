const express = require('express');

const router = express.Router();

const
{
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist,
} = require('../services/wishlistServices');


const authServices = require('../services/authServices');

//---------------------------------------------------


router.route('/')
.post(authServices.protect, authServices.allowedTo('user'), addProductToWishlist)
.get(authServices.protect, authServices.allowedTo('user'), getLoggedUserWishlist)

router.route('/:productId')
.delete(authServices.protect, authServices.allowedTo('user'), removeProductFromWishlist)



module.exports = router;