const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, `Order must belong to a user`]
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
            color: String,
            price: Number,
        },
    ],

    taxPrice: {
        type:  Number,
        default: 0
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },

    totalOrderPrice: {
        type: Number,
    },
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash',
    },
    
    isPaid: {
    type: Boolean,
    default: false,
    },

    paidAt: Date,
    isDelivred: {
        type: Boolean,
        default: false,
    },
    delivredAt: Date,
    


}, {timestamps: true});

orderSchema.pre(/^find/, function (next) {
    this.populate({path: 'user', select: 'name email phone'})
    .populate({path: 'cartItems.product', select: 'title imageCover price'})
    next();
});

const model = mongoose.model('order', orderSchema);

module.exports = model;