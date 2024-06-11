const ApiError = require('../utils/apiError');


const sendErrorForDev = (error, res) => {
        res.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
            stack: error.stack
        });
    };

const sendErrorForPr = (error, res) => {
        res.status(error.statusCode).json({
        message: error.message,
        status: error.status
    });
};

const handleJwtInvalidSignture = () => new ApiError('invalid token, must to login to get an access', 401);


const globalError = (error, req, res, next) => {   
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Error';
    if(process.env.NODE_ENV === 'development') {
        sendErrorForDev(error, res);
    } else{
        if(error.name === 'JsonWebTokenError') {
            error = handleJwtInvalidSignture();
        }
        sendErrorForPr(error, res);
    } 
};




module.exports = globalError;