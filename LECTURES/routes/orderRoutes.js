const express = require('express');

const router = express.Router();

const 
{
    filterOrderForLoggedUser,
    createCashOrder,
    getLoggedUserOrders,
    getSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivred,
    getCheckoutSession,
} = require('../services/orderServices');

const authServices = require('../services/authServices');

//--------------------------------------------------------


router.route('/:cartId')
.post(authServices.protect, authServices.allowedTo('user'), createCashOrder)

router.route('/')
.get
(
    authServices.protect,
    authServices.allowedTo('user', 'admin', 'manger'),
    filterOrderForLoggedUser,
    getLoggedUserOrders
)



router.route('/:orderId')
.get
(
    authServices.protect,
    authServices.allowedTo('user', 'admin', 'manger'),
    filterOrderForLoggedUser, 
    getSpecificOrder
)
router.route('/:orderId/pay')
.put
(
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),
    updateOrderToPaid,
);


router.route('/:orderId/delivred')
.put
(
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),
    updateOrderToDelivred,
);

router.route('/checkout-session/:cartId')
.get
(
    authServices.protect,
    authServices.allowedTo('user'),
    getCheckoutSession,
)





module.exports = router;