const factory = require('./factoryhandler');

const asyncHandler = require('express-async-handler');

const BrandModel = require('../models/BrandModel');

const ApiError = require('../utils/apiError');

const multer = require('multer');

const sharp = require('sharp');

const {v4: uuidv4} = require('uuid')

const {uploadSingleImage} = require('../middlewares/uploadImagesMiddleware');

//-------------------------------------------------------------

exports.uploadBrandImage = uploadSingleImage('image');

exports.resizeImage = asyncHandler( async(req, res, next) => {

    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
    
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`uploads/brands/${filename}`);   
    
    req.body.image = filename;

    next();


});





//-------------------------------------------------------------
exports.createBrand = factory.createOne(BrandModel);

exports.getAllBrands = factory.getAll(BrandModel);

exports.updateBrand = factory.updateOne(BrandModel);

exports.deleteBrand = factory.deleteOne(BrandModel);

exports.getOneBrand = factory.getOne(BrandModel);