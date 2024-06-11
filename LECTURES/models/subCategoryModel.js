const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, /* Remove sapces */
        unique: [true, 'Subcategory must be unique'],
        minlength: [2, 'Name must be at least 2 chars'],
        maxlength: [32, 'Max chars of name 32 chars']
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Subcategory must belong to a parent Category']
    }

}, {timestamps: true});

const subCategoryModel = mongoose.model('subCategory', subCategorySchema);


module.exports = subCategoryModel;



