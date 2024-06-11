const {check, body} = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const CategoryModel = require('../../models/categoryModel');

const SubCategoriesModel = require('../../models/subCategoryModel');

// eslint-disable-next-line import/order
const slugify = require('slugify');
//----------------------------------------------------------------

exports.createProductValidator = 
[
    check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({min: 2})
    .withMessage('Type at least 2 chars for product title')
    .isLength({max: 200})
    .withMessage('Maximum chras of title is 50')
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
 
    })
    ,
    check('description')
    .notEmpty()
    .withMessage('Description is required') 
    .isLength({min: 2})
    .withMessage('Minimum length of product description is 20 chars')
    ,
    check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number')
    ,
    check('sold')
    .optional()
    .isNumeric()
    .withMessage('Sold must be a number')
    ,
    check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isLength({max: 10})
    .withMessage('Too long product price')
    .isNumeric()
    .withMessage('Price must be a number')
    ,
    check('priceAfterDiscount')
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage('Descount must be a number')
    .custom((value, { req}) => {
        if(req.body.price <= value) {
            throw new Error ('Descount must be lower than price')
        };
        return true;
    })
    ,
    check('colors')
    .optional()
    .isArray()
    .withMessage('colors must an array')
    ,
    check('imageCover')
    .notEmpty()
    .withMessage('Product imageCover is required')
    ,
    check('image')
    .optional()
    .isArray()
    .withMessage('Product image must be an array')
    ,
    check('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category Id')
    .custom( async (value) => {
        const category = await CategoryModel.findById(value);
        if(!category) {
            throw new Error ('No such category for this Id');
        }   
    })
    ,
    check('subCategories')
    .optional()
    .isMongoId()
    .withMessage('Check mongoDB Id')
    .custom( async (value) => {
        const subCategories = await SubCategoriesModel.find({ _id: {$exists: true, $in: value}});
        if(subCategories.length < 1 || subCategories.length !== value.length) {
            throw new Error ('Check ids of SubCategories');
        }
    })
    .custom( async (values, {req}) => {

        const subCategories = await SubCategoriesModel.find({category: req.body.category});
            const subCategoriesIdsInDB = [];
            subCategories.forEach( (value) => {
                subCategoriesIdsInDB.push(value._id.toString());
            }); 
            
            if(!values.every( v => subCategoriesIdsInDB.includes(v))) {
                throw new Error ('Subcategories ids do not belong to this category');
            }    
            //661d220270385ff04622c8f0
            //661b9ad78a5878c5566bce1c
    })
    ,
    check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand Id')
    ,
    check('ratingAverage')
    .optional()
    .isNumeric()
    .withMessage('Rating average must be a number')
    .isLength({min: 1})
    .withMessage('Rating must be at least 1')
    .isLength({max: 5})
    .withMessage('Rating cannot be more than 5')
    ,
    check('ratingQuantity')
    .optional()
    .isNumeric()
    .withMessage('Rating quantity must be a number')
    ,
    validatorMiddleware
];

//----------------------------------------------------------------

exports.getSpecificProductValidator = 
[
    check('id')
    .isMongoId()
    .withMessage(`Check MongoDB Id`)
    ,
    validatorMiddleware
];

//----------------------------------------------------------------

exports.updateProductValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('Invalid mongoId')
    ,
    body('title')
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    })
    ,
    validatorMiddleware
];

//----------------------------------------------------------------

exports.deleteProductValidator = 
[
    check('id')
    .isMongoId()
    .withMessage('Invalid mongoId')
    ,
    validatorMiddleware
];
