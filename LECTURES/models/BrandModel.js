const mongoose = require('mongoose');

const BrandModel = new mongoose.Schema({

    name: String,
    slug: {
        type: String,
        lowecase: true
    },
    image: String,



}, {timestamb: true});

const setImageUrl = (doc) => {

    if(doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    };
};

// Works on Find all / find one / update
BrandModel.post('init', (doc) => {

    setImageUrl(doc);
});
BrandModel.post('save', (doc) => {

    setImageUrl(doc);

});

const model = mongoose.model('brand', BrandModel);

module.exports = model;
