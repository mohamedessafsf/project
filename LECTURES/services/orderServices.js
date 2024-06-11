const asyncHandler = require('express-async-handler');

const stripe = require('stripe')('sk_test_51PPJviRxzrjLiD18cgtGlPiuFm2aCSKStWN8ZVcaEIoRsrDqBt8kB0SXmcgeK4ch2kDGL78fFdrd3DiUtQPIq53t00kPzj7Bd9');

const ApiError = require('../utils/apiError');

const ProductModel = require('../models/productModel');

const CartModel = require('../models/cartModel');

const OrderModel = require('../models/orderModel');

const factory = require('./factoryhandler');

//------------------------------------------------------------

exports.filterOrderForLoggedUser = asyncHandler( async (req, res, next) => {
    if(req.user.role === 'user') {
        req.filterObj = {user: req.user._id}
    };

    next();
});  



// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  protected/user

exports.createCashOrder = asyncHandler( async (req, res, next) => {

    const shippingPrice = 0;
    const taxPrice = 0;
    // 1) get logged user cart based on cart id
    let cart = await CartModel.findOne({user: req.user._id});
    if(!cart) {
        return next(new ApiError(`no cart found for this user: ${req.user._id}`, 404));
    };
    // 2) get order price depend on cart total price and check if there is a coupon is allowed to use
    const totalCartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const orderPrice = totalCartPrice;
    
    // 3) create order with default paymentMethodType (cash)
    const order = await OrderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.address, 
        paymentMethodType: req.body.payment,
        totalOrderPrice: orderPrice,
    });
    // 4) after creating order, need to decrement the quantity of product and increment product sold
    // if(order) {

    //     for(let i = 0; i < cart.cartItems.length; i ++ ) {
            
    //         const product = await ProductModel.findOne({_id: cart.cartItems[i].product});
    //         product.quantity -= cart.cartItems[i].quantity;
    //         product.sold += cart.cartItems[i].quantity;
    //         await product.save();
    //     };
    //     // 5) clear cart depand on cart id
    //     cart = await CartModel.deleteMany({});
    // };

    if(order) {

    const bulkOptions = cart.cartItems.map(item => ({
        updateOne: {
            filter: {_id: item.product},
            update: {$inc: {quantity: -item.quantity, sold: +item.quantity}}
        }
    }));
    await ProductModel.bulkWrite(bulkOptions, {});
    await CartModel.deleteMany({});
    };

    res.status(200).json({
        msg: `order created`,
        data: order,
    });
    
});


// @desc    get logged user orders
// @route   GET /api/v1/orders
// @access  protected/user-admin-manger

exports.getLoggedUserOrders = factory.getAll(OrderModel);


// @desc    get a specific order
// @route   GET /api/v1/orders/:id
// @access  protected/user-admin-manger

exports.getSpecificOrder = asyncHandler( async (req, res, next) => {

    let order = 0;
    if(req.user.role === 'admin' || req.user.role === 'manger') {
    
     order = await OrderModel.findOne({_id: req.params.orderId});
    }else if(req.user.role === 'user'){
        
     order = await OrderModel.findOne({user: req.user._id, _id: req.params.orderId});
    }else {
        
    if(!order) {
        return next(new ApiError(`invalid order, no order found for this user: ${req.user._id}`, 404));
    };

    };

    res.status(200).json({data: order});
});


// @desc update isDelivred and delivredAt in order
// @route   PUT /api/v1/orders/:orderId/delivred
// @access  protected/admin-manger

exports.updateOrderToDelivred = asyncHandler( async (req, res, next) => {

    const order = await OrderModel.findById(req.params.orderId);

    if(!order) {
        return next(new ApiError(`no order for this order id: ${req.params.orderId}`, 404));
    };
    order.isDelivred = true;
    order.delivredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({data: updatedOrder});

});




// @desc    updata isPaid and paidAt in order
// @route   PUT /api/v1/orders/:orderId/pay
// @access  protected/admin-manger

exports.updateOrderToPaid = asyncHandler( async(req, res, next) => {

    const order = await OrderModel.findById(req.params.orderId);

    if(!order) {
        return next(new ApiError(`no order for this order id: ${req.params.orderId}`, 404));
    };
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({data: updatedOrder});

});


// @desc    get checkout session from stripe and send it as response 
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  protected/user
exports.getCheckoutSession = asyncHandler( async(req, res, next) => {

    const taxPrice = 0;
    const shippingPrice = 0;
    
    const cart = await CartModel.findOne({user: req.user._id, _id: req.params.cartId});
    if(!cart) {
        return next(new ApiError(`no cart found for this user: ${req.user._id}`, 404));
    };
    
    
    const cartPrice = cart.totalPriceAfterDiscount? cart.totalPriceAfterDiscount : cart.totalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;


    const createPrice = await stripe.prices.create({
        currency: 'usd',
        unit_amount: totalOrderPrice * 100,
        product_data: {
            name: 'product name',
        }        
    });

    console.log(createPrice);

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: createPrice.id,
                quantity: 1,
            }
        ],
        mode: 'payment',
        // return_url: `${req.protocol}://${req.get('host')}/orders`,
        success_url: `${req.protocol}://${req.get(`host`)}/orders`,
        cancel_url: `${req.protocol}://${req.get(`host`)}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress, 
    });

    res.status(200).json({status: `success`, session}); 

});

















