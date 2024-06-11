
/* eslint-disable import/order */

const asyncHandler = require('express-async-handler');

const multer = require("multer");

const {v4: uuidv4} = require('uuid');

const sharp = require('sharp');

const ProductModel = require('../models/productModel');
const factory = require('./factoryhandler');
const ApiError = require('../utils/apiError');

const {uploadMixOfImages} = require('../middlewares/uploadImagesMiddleware');
//--------------------------------------------------

exports.uploadProductImages = uploadMixOfImages([
{
    name: 'imageCover',
    maxCount: 1,
},
{
    name: 'images',
    maxCount: 5,
}
]);


exports.resizeProductImages = asyncHandler( async (req, res, next) => {
if(req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)    
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({quality: 95})
    .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName; 
    console.log(req.body.imageCover);
};

if(req.files.images) {

    req.body.images = [];

    await Promise.all(

        req.files.images.map( async (img, index) => {
            const imgName = `products-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

            await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({quality: 95})
            .toFile(`uploads/products/${imgName}`);
            req.body.images.push(imgName);
        })
    ); 

    console.log(req.body.images);
};
    next();
});
//--------------------------------------------------


    

//--------------------------------------------------
//@desc     Get products
//route     GET /api/v1/products
//access    Puplic

exports.getProducts = factory.getAll(ProductModel);

//--------------------------------------------------
//@desc     Create products
//route     POST /api/v1/products/:id
//access    Private

exports.createProduct = factory.createOne(ProductModel);

//--------------------------------------------------
//@desc     Get brand
//route     GET /api/v1/products/:id
//access    Public


exports.getSpecificProduct = factory.getOne(ProductModel, 'reviews');

//--------------------------------------------------
//@desc     Update brand
//route     PUT /api/v1/products/:id
//access    Private

exports.updateProduct = factory.updateOne(ProductModel);

//----------------------------------------------------------------
//@desc     Delete brand
//route     DELETE /api/v1/product/:id
//access    Private

exports.deleteProduct = factory.deleteOne(ProductModel);
