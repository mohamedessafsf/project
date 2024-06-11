const SubCategoryModel = require('../models/subCategoryModel');

const factory = require('./factoryhandler');

//----------------------------------------------------------

exports.setCategoryIdToBody = (req, res, next) => {

    if(!req.body.category) req.body.category = req.params.categoryid;
    next();
};
// @desc        Create subCategories
// @route       POST /api/v1/subcategories
// @access      Private

exports.createSubCategory = factory.createOne(SubCategoryModel);
//----------------------------------------------------------
//Nested route      GET /api/v1/categories/:categoryId/subcategories

//@desc             Get categories
// @route           GET /api/v1/subcategories
//@accesss          Puplic

exports.createFilterObject = (req, res, next) => {
    
    let filterObject = {};
    if(req.params.id) filterObject = {category: req.params.id};
    req.filterObj = filterObject;    
    next();
};

exports.getSubCategories = factory.getAll(SubCategoryModel);
//----------------------------------------------------------

//@desc         Get specific category
// @route       GET /api/v1/subcategories/:subId
//@accesss      Puplic


exports.getSpecificSubCategory = factory.getOne(SubCategoryModel);
//----------------------------------------------------------

//@desc         Update specific category
// @route       PUT /api/v1/subcategories/:subId
//@accesss      Private

exports.updateSpecificSubCategory = factory.updateOne(SubCategoryModel)
//----------------------------------------------------------

//@desc         Delete specific category
//@route        DELETE /api/v1/subcategories/:subId
//@accesss      Private

exports.deleteSpecificSubCategory = factory.deleteOne(SubCategoryModel)





