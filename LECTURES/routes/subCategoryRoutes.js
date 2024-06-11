const express = require('express');

// mergeParams allow us to to access to the parameters of other routers
const router = express.Router({mergeParams: true});

const 
{
    createSubCategory,
    getSubCategories,
    getSpecificSubCategory,
    updateSpecificSubCategory,
    deleteSpecificSubCategory,
    setCategoryIdToBody,
    createFilterObject
} = require('../services/subCategoryServices');


const 
{
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require('../utils/validators/subCategoryValidator')

const authServices = require('../services/authServices');
//-------------------------------------------------------


router.route('/')
.post
(
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),
    setCategoryIdToBody, 
    createSubCategoryValidator, 
    createSubCategory
)
.get(createFilterObject, getSubCategories);


router.route('/:id')
.get(getSubCategoryValidator, getSpecificSubCategory)
.put
(
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),
    updateSubCategoryValidator, 
    updateSpecificSubCategory
)
.delete
(
    authServices.protect,
    authServices.allowedTo('admin'),
    deleteSubCategoryValidator, 
    deleteSpecificSubCategory
);

module.exports = router;
