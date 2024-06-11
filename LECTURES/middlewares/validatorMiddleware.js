// Find errors => validationResult(req) ... in Requests and Store it in Error const then wrap them in an object
const {validationResult} = require('express-validator');

const validatorMiddleware = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ Errros: errors.array() });
    };
    next();
};


module.exports = validatorMiddleware; 