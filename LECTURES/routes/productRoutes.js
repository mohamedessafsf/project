const express = require('express');

const router = express.Router();

const reviewsRoutes = require('./reviewRoutes');

router.use('/:productId/reviews', reviewsRoutes);

const 
{
    getProducts,
    createProduct,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages,
} = require('../services/productServices');

const 
{
    createProductValidator,
    getSpecificProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require('../utils/validators/productValidator');


//----------------------------------------------------------------

router.route('/')
.get(getProducts)
.post (
uploadProductImages,
resizeProductImages,
createProductValidator, 
createProduct, 
);

router.route('/:id')
.get(getSpecificProductValidator, getSpecificProduct)
.put
(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
)
.delete(deleteProductValidator, deleteProduct);

module.exports = router;
