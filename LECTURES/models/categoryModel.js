const mongoose = require('mongoose');

// Create Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'This Category is already exist'],
    },
    slug: {
        type: String,
        lowercase: true,
    }, 
    image: {
        type: String
    }
}, {timestamps: true /*Allow to create two feilds in database*/});


const setImageUrl = (doc) => {

    if(doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    };
};

// Works on Find all / find one / update
categorySchema.post('init', (doc) => {

    setImageUrl(doc);
});
categorySchema.post('save', (doc) => {

    setImageUrl(doc);

});


// Create a model
const categoryModel = mongoose.model('Category', categorySchema);


module.exports = categoryModel;
