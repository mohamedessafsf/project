const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Type at least 2 chars for product title'],
        maxlength: [200, 'Maximum chras of title is 50']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        minlength: [2, 'Mimimum length of product description is 20 chars'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required']
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        trim: true, 
        max: [10000000000, 'Too long product price']
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: {
        type: [String]
    },
    imageCover: {
        type: String,
        required: [true, 'Cover is required']
    },
    images: [String]
    ,
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belong to another category']
    },
    subCategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',

    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be at least 1 or above'],
        max: [5, 'Maximum rating of product is 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    }

}, 
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});






ProductSchema.virtual('reviews', {
    ref: 'review',
    foreignField: 'product',
    localField: '_id'

});

const setImagesUrl = (doc) => {
    if(doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    };

    if(doc.images) {
        const imagesList = [];
            doc.images.forEach( (image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        doc.images = imagesList;
    };
};


ProductSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'category',
        select: 'name',
    });
    next();  
});

ProductSchema.post("init", (doc) => {
    setImagesUrl(doc);
}
);
ProductSchema.post("save", (doc) => {
    setImagesUrl(doc);
}
);


const product = mongoose.model('Product', ProductSchema);

module.exports = product;
 