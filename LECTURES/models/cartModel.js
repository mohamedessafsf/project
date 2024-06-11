const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({

    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
            color: String,
            price: Number,
        },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
});

const model = mongoose.model('cart', CartSchema);

module.exports = model;

