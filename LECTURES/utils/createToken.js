const jwt = require('jsonwebtoken');


const createToken = function (payload) {
    return jwt.sign({userId: payload}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_TIME})
};


module.exports = createToken;