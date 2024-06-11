const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');

const CouponModel = require('../models/couponModel');

const CartModel = require('../models/cartModel');

const ProductModel = require('../models/productModel');

//--------------------------------------------------------------

const calcTotalPrice = (cart) => {

    let totalPrice = 0;

    cart.cartItems.forEach(product => {
        totalPrice += product.quantity * product.price;
    });
    cart.totalPrice = totalPrice;
};


// @desc    add product to cart
// @route   POST /api/v1/cart
// @access  protected/user

exports.addProductToCart = asyncHandler( async (req, res, next) => {

    const {product, color} = req.body;
    const getProduct = await ProductModel.findById(product);
    // 1) get logged user cart
    let cart = await CartModel.findOne({user: req.user._id});
    if(!cart) {
        // create a cart for user with the first product
        cart = await CartModel.create(
            {
                user: req.user._id,
                cartItems: [{product, color, price: getProduct.price}]
            });        
    }else {
    // 1) if the product is already in the cart, update quantity
    const productIndex = cart.cartItems
    .findIndex
    (
        (item) => item.product.toString() === product && item.color === color 
    );
    if(productIndex > -1) {
        cart.cartItems[productIndex].quantity += 1;
    }else {
        // 2) if not exist push product in cart
        cart.cartItems.push({product, color, price: getProduct.price});
    };
    };

    // calcualate total price of the products in cart
    calcTotalPrice(cart);
    
    await cart.save();
    res.status(200).json(
        {
            msg: `product added successfully`, 
            data: cart.cartItems, 
            totalPrice: cart.totalPrice});
});



// @desc    get logged user cart products
// @route   GET /api/v1/cart
// @access  protected/user

exports.getLoggedUserCartProducts = asyncHandler( async (req, res, next) => {

    const cart = await CartModel.findOne({user: req.user._id});

    if(!cart) {
        return next(new ApiError(`no cart found for this user: ${req.user._id}`), 404);
    };

    res.status(200).json({results: cart.cartItems.length, data: cart.cartItems, totalPrice: cart.totalPrice});
});



// @desc    remove product from cart
// @route   POST /api/v1/auth/:productId
// @access  protected/user
exports.removeProductFromCart = asyncHandler( async (req, res, next) => {
   
    const cart = await CartModel.findOneAndUpdate({user: req.user._id},

        {
            $pull: {cartItems: {_id: req.params.itemId}},
        }, {new: true});

        calcTotalPrice(cart);
        await cart.save();

        res.status(200).json({results: cart.cartItems.length, msg: `item removed`, data: cart.cartItems});
});


// @desc    clear cart
// @route   DELETE /api/v1/cart
// @access  protected/user
exports.clearLoggedUserCart = asyncHandler( async(req, res, next) => {

    const cart = await CartModel.findOneAndDelete({user: req.user._id});

    res.status(200).json({msg: `cart cleard`});
});

// @desc    update quantity of a product 
// @route   PUT /api/v1/:productId
// @access  protected/user

exports.updateProductQuantity = asyncHandler( async (req, res, next) => {

    const cart = await CartModel.findOne({user: req.user._id});

    if(!cart) {
        return next(new ApiError(`no cart found for this user: ${req.user._id}`, 404));
    };

    // let index = 0;
    let product = 0;
    cart.cartItems.forEach((item, i) => {
        if(item._id.toString() === req.params.itemId.toString()) {
            item.quantity = req.body.quantity;
            // index = i;
            product = item;
        };
    });
    if(typeof product === 'number') {
        return next(new ApiError(`no product found`, 404));
    };
    const totalPrice = calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({msg: `product updated`, data: cart.cartItems, totalPrice});

}); 
 

// @desc    apply coupon on logged user cart
// @route   PUT /api/v1/applycoupon
// @access  protected/user

exports.applyCouponOnUserCart = asyncHandler( async (req, res, next) => {
    // 1) get coupon based on coupon name
    // 2) check if coupon is valid by expire time
    const coupon = await CouponModel.findOne({name: req.body.name, expire: {$gt: Date.now()}});
    if(!coupon) {
        return next(new ApiError(`this coupon is invalid or expired`, 400));
    };
    const cart = await CartModel.findOne({user: req.user._id});
    if(!cart) {
        return next(new ApiError(`no cart found for this user: ${req.user._id}`, 404))
    };
    // calc totalPrice of cart - dicount of coupon
    const totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * coupon.discount / 100)).toFixed(2);
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    
    await cart.save();

    res.status(200).json(
        {
            msg: `you have a discount`, 
            data: cart,
        });

});

