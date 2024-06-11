const UserModel = require('../models/userModel');

const factory = require('./factoryhandler');

const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');

//------------------------------------------------------

//@desc     Add product to wishlist of users
//route     POST /api/v1/wishlist
//access    protected/user

exports.addProductToWishlist = asyncHandler( async (req, res, next) => {

    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        // $addToSet => add productId to wishlist array if productId does not exist
        // if productId is already exist in array the operator will not work 
        $addToSet: {wishlist: req.body.productId}
    }, {new: true});

    if(!user) {
        return next(new ApiError(`no id for this user: ${req.user._id}`, 404));
    };

    res.status(200).json({data: user.wishlist});
});



//@desc     Remove product from wishlist of users
//route     DELETE /api/v1/wishlist/:productId
//access    protected/user

exports.removeProductFromWishlist = asyncHandler( async (req, res, next) => {
    // $pull => remove productId from wishlist array if the productId is exist
    // if not exist the operator will ignore it
    const user = await UserModel.findByIdAndUpdate(req.user._id, 
        {
            $pull: {wishlist: req.params.productId},

        }, {new: true})
    
        res.status(200).json({msg: `product removed successfully from with list`, data: user.wishlist})

});

//@desc     get logged user wishlist
//route     GET /api/v1/wishlist/:productId
//access    protected/user

exports.getLoggedUserWishlist = asyncHandler( async (req, res, next) => {

    const user = await UserModel.findById(req.user._id).populate('wishlist');

    res.status(200).json({results: user.wishlist.length, data: user.wishlist});

});


