const express = require('express');

const router = express.Router();

const 
{
    createBrand,
    getAllBrands,
    updateBrand,
    deleteBrand,
    getOneBrand,
    uploadBrandImage,
    resizeImage
} = require('../services/brandServices');


const 
{
    createBrandValidator,
    getSpecificBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validators/brandValidator');

const authServices = require('../services/authServices');
//---------------------------------------------------------

router.route('/')
.post
(   
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),
    uploadBrandImage, 
    resizeImage, 
    createBrandValidator, 
    createBrand)
.get(getAllBrands);

router.route('/:id')
.get(getSpecificBrandValidator, getOneBrand)
.put
(
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),
    uploadBrandImage, 
    resizeImage, 
    updateBrandValidator, 
    updateBrand
)
.delete
(   
    authServices.protect,
    authServices.allowedTo('admin'),
    deleteBrandValidator, 
    deleteBrand,
);

module.exports = router;