/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require('express-async-handler');

const multer = require('multer');

const {v4: uuidv4} = require('uuid');

const sharp = require('sharp');
//-------------------

const categoryModel = require('../models/categoryModel');

const ApiError = require('../utils/apiError');

const factory = require('./factoryhandler');

const {uploadSingleImage} = require('../middlewares/uploadImagesMiddleware');

//-------------------------------------------------------


exports.uploadCategoryImage = uploadSingleImage('image');


exports.resizeImage = asyncHandler( async(req, res, next) => {

    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`uploads/categories/${filename}`);   
    
    req.body.image = filename;

    next();


});


//--------------------------------------------------
// desc     Get list of categories
// route    GET /api/v1/categories
// access   Public

exports.getCategories = factory.getAll(categoryModel);
// --------------------------------------------------
// @desc        Get specific category
// @route       GET /api/v1/categories/:id
// @access      Public

exports.getCategory = factory.getOne(categoryModel);

// --------------------------------------------------
// @desc        Create Categories
// @route       POST /api/v1/categories
// @access      Private

exports.createCategories = factory.createOne(categoryModel);

//------------------------------------------------------

// @desc        Update Specific Category
// @route       PUT /api/v1/categories/:id
// @access      Private

exports.updateCategory = factory.updateOne(categoryModel);

//------------------------------------------------------

//@desc     Delete specific category
//@route    DELETE /api/v1/categories/:id
//@access   Private

exports.deleteCategory = factory.deleteOne(categoryModel);

//------------------------------------------------------




