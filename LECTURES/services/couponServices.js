const asyncHandler = require('express-async-handler');


const CouponModel = require('../models/couponModel');


const factory = require('./factoryhandler');
//--------------------------------------------------


//@desc     create coupons
//route     POST /api/v1/coupons
//access    admin/manger
exports.createCoupon = factory.createOne(CouponModel);



//@desc     get all coupons
//route     GET /api/v1/coupons
//access    admin/manger
exports.getCoupons = factory.getAll(CouponModel);



//@desc     get a coupon
//route     GET /api/v1/coupons/:couponId
//access    admin/manger
exports.getOneCoupon = factory.getOne(CouponModel);

//@desc     update a coupon
//route     PUT /api/v1/coupons/:couponId
//access    admin/manger
exports.updateCoupon = factory.updateOne(CouponModel);


//@desc     delete coupons
//route     DELETE /api/v1/coupons/:couponId
//access    admin/manger
exports.deleteCoupon = factory.deleteOne(CouponModel);


