const UserModel = require('../models/userModel');

const ApiError = require('../utils/apiError');

const bcrypt = require('bcryptjs');
const multer = require('multer');

const sharp = require('sharp');

const {v4: uuidv4} = require('uuid');

const asyncHandler = require('express-async-handler');

const factory = require('./factoryhandler');

const {uploadSingleImage} = require('../middlewares/uploadImagesMiddleware');

const createToken = require('../utils/createToken');

//----------------------------------------------------


exports.uploadUserImage = uploadSingleImage('profileImage');

exports.resizeImage = asyncHandler(async (req, res, next) => {

    const userImageName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    
    if(req.file) {
        
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({quality: 95})
        .toFile(`uploads/users/${userImageName}`);
    
        req.body.profileImage = userImageName;
        
    };

    next();

});


exports.createUser = factory.createOne(UserModel);

exports.getAllUsers = factory.getAll(UserModel);

exports.updateUser = asyncHandler( async (req, res, next) => {

    const updateUser = await UserModel.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {new: true});
    if(!updateUser) {
        return next(new ApiError(`No document for this id: ${req.originalUrl}`, 404));
    };
    res.status(200).json({Result: updateUser});
});


exports.changePassword = asyncHandler( async (req, res, next) => {

    const changePassword = await UserModel.findByIdAndUpdate( req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        },
        {
            new: true
        }
    )
    if(!changePassword) {
        next( new ApiError( `no document for this id: ${req.originalUrl}`, 400));
    };

    const token = createToken(changePassword._id);
    res.status(200).json({data: changePassword, token});

});


exports.deleteUser = factory.deleteOne(UserModel);

exports.getOneUser = factory.getOne(UserModel);
 

// @desc    get logged user data
// @route   GET /api/users/getme
// @access  private/protect

exports.getLoggedUserData = asyncHandler( async (req, res, next) => {

    req.params.id = req.user._id;
    next();

});


// @desc    update logged user password
// @route   PUT /api/users/updateloggeduserpassword
// @access  private/protect

exports.updateLoggedUserPassword = asyncHandler( async (req, res, next) => {

    // 1) update user password based user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(req.user._id,    
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {new: true}
    );

    // 2) generate token
    
    if((await bcrypt.compare(req.body.password, user.password))) {

        return next( new ApiError (`try another password`, 401));
    };

    const token = createToken(user._id);
    res.status(200).json({data: user, token});
});


// @desc    update logged user data without (password, role)
// @route   PUT /api/users/updateloggeduserdata
// @access  private/protect

exports.updateLoggedUserData = asyncHandler( async (req, res, next) => {

    const updatedUser = await UserModel.findByIdAndUpdate (req.user._id, {
        
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
    }, {new: true});

    if(!updatedUser) {
        return next(new ApiError (`wrong user, cannot find user`, 404));
    }; 

    res.status(200).json({msg: `success request`, data: updatedUser}); 
});


// @desc    delete logged user account
// @route   DELETE /api/users/deleteloggeduseraccount
// @access  private/protect

exports.deleteLoggedUserAccount = asyncHandler( async (req, res, next) => {

    const user = await UserModel.findByIdAndUpdate(req.user._id,
        {active: false},    
    );

    res.status(200).json({msg: `user active is: false`});

});