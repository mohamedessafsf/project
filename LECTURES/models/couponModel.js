const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'coupon name is required'],
        unique: true
    },
    
    expire: {
        type: Date,
        required: [true, 'this coupon is expired'],
    },

    discount: {
        type: Number,
        required: [true, `coupon discount value is required`]
    },


}, {timestamps: true});




const model = mongoose.model('coupon', CouponSchema);

module.exports = model;