const asyncHandler = require('express-async-handler');

const UserModel = require('../models/userModel');

//-------------------------------------------------------------


//@desc     add addresses to user
//route     POST /api/v1/address
//access    protected/user

exports.addAdressToUser = asyncHandler( async (req, res, next) => {

    const user = await UserModel.findByIdAndUpdate(req.user._id, 
        {
            $addToSet: {address: req.body}
        }, {new: true});

        res.status(200).json({msg: `success`, data: user.address})

});


//@desc     remove address from user
//route     DELETE /api/v1/address/:addressId
//access    protected/user

exports.removeAddressFromUser = asyncHandler( async (req, res, next) => {

    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: {address: {_id: req.params.addressId}},
    }, {new: true})

    res.status(200).json({msg: `address removed`, data: user.address});
});


//@desc     get user addresses
//route     GET /api/v1/address
//access    protected/user

exports.getUserLoggedAddress = asyncHandler( async (req, res, next) => {

    const user = await UserModel.findById(req.user._id).populate('address');

    res.status(200).json({data: user.address});
});