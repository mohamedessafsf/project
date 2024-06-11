const express = require('express');

const router = express.Router();

const 
{
    createCoupon,
    getCoupons,
    getOneCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../services/couponServices');

const authServices = require('../services/authServices');

//----------------------------------------------------------


router.route('/')
.post(authServices.protect, authServices.allowedTo('admin', 'manger'), createCoupon)
.get(authServices.protect, authServices.allowedTo('admin', 'manger'), getCoupons);

router.route('/:id')
.get(authServices.protect, authServices.allowedTo('admin', 'manger'), getOneCoupon)
.put(authServices.protect, authServices.allowedTo('admin', 'manger'), updateCoupon)
.delete(authServices.protect, authServices.allowedTo('admin', 'manger'), deleteCoupon);

module.exports = router;
