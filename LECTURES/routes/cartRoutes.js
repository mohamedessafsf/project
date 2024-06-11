const express = require('express');

const router = express.Router();

const 
{
    addProductToCart,
    getLoggedUserCartProducts,
    removeProductFromCart,
    clearLoggedUserCart,
    updateProductQuantity,
    applyCouponOnUserCart,
} = require('../services/cartServices');

const authServices = require('../services/authServices');

//---------------------------------------------------------

router.route('/')
.post(authServices.protect, authServices.allowedTo('user'), addProductToCart)
.get(authServices.protect, authServices.allowedTo('user'), getLoggedUserCartProducts)
.delete(authServices.protect, authServices.allowedTo('user'), clearLoggedUserCart)

router.route('/applycoupon')
.put(authServices.protect, authServices.allowedTo('user'), applyCouponOnUserCart);

router.route('/:itemId')
.delete(authServices.protect, authServices.allowedTo('user'), removeProductFromCart)
.put(authServices.protect, authServices.allowedTo('user'), updateProductQuantity)


router.route('/')
module.exports = router;