const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: String,
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpire: Date,
    passwordResetCodeVerified: Boolean,
    
    role: {
        type: String,
        enum: ['user','admin', 'manger'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        
    }],
    address: [
        {
            id: {type: mongoose.Schema.Types.ObjectId},
            alias: String,
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        }
    ],



}, {timestamps: true});


const setUrlToProfileImg = (doc) => {

    if(doc.profileImage) {
        
        const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`
        doc.profileImage = imageUrl;
    };
};

UserSchema.pre('save', async function(next) {

    if(!this.isModified('password')) {
        
        return next();  
    };
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


UserSchema.post('init', (doc) => {
    setUrlToProfileImg(doc);
});

UserSchema.post('save', (doc) => {
    setUrlToProfileImg(doc);
});

const user = mongoose.model('user', UserSchema);

module.exports = user;