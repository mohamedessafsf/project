const express = require('express');

const router = express.Router();
//-----------------
const subCategoryRoute = require('./subCategoryRoutes');

router.use('/:categoryId/subcategories', subCategoryRoute);


//-----------------

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/categoryValidator');

const {
    getCategories,
    getCategory,
    createCategories, 
    updateCategory, 
    deleteCategory,
    uploadCategoryImage,
    resizeImage
} = require('../services/categoryServices');

const authServices = require('../services/authServices');

router.use(authServices.protect, authServices.allowedTo('manger', 'admin'));
//----------------------------------------------------------


// Routes
router.route('/')
.get(getCategories)
.post
(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator, 
    createCategories
);

/*
1- Rules
2- Middleware => Catch error from rules if exist
*/
router.route('/:id')
.get(getCategoryValidator, getCategory)
.put
(
uploadCategoryImage,
resizeImage,
updateCategoryValidator, 
updateCategory
)
.delete
(
    deleteCategoryValidator, 
    deleteCategory 
);




module.exports = router;