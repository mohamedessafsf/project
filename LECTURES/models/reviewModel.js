const mongoose = require('mongoose');

const ProductModel = require('./productModel');

const reviewSchema = new mongoose.Schema({

    title: String,
    ratings: {
        type: Number,
        min: [1, 'minimum rating is 1.0'],
        max: [5, 'maximum rating is 5.0'],
        required: [true, 'rating is required'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'review must belong to a user'],
    },

    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'review must belong to a product'],
    },
}, {timestamps: true});


reviewSchema.pre(/^find/, function (next) {
    this.populate({path: 'user', select: 'name'});
    next()
});


reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {

    const result = await this.aggregate 
    ([
        {$match: {product: productId}},
        {$group: 
            {
                _id: 'product',
                ratingsQuantity: {$sum: 1},
                avgRatings: { $avg: "$ratings"},
            }}
    ]);
    console.log(result);
    if(result.length > 0) {
        await ProductModel.findByIdAndUpdate(productId,
            {
                ratingsAverage: result[0].avgRatings,
                ratingQuantity: result[0].ratingsQuantity,
            },
            {new: true}
        );
    }else {
        await ProductModel.findByIdAndUpdate(productId,
            {
                ratingsAverage: 0,
                ratingQuantity: 0,
            },
            {new: true}
        );        
    };
};

reviewSchema.post('save', async function() {
    await this.constructor.calcAverageRatingAndQuantity(this.product);
});


reviewSchema.post('remove', async function() {
    await calcAverageRatingAndQuantity(this.product);
});



const model = mongoose.model('review', reviewSchema);


module.exports = model;