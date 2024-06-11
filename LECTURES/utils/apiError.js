// @desc    Class is responsible about operation errors (Error that i can predict)
//----------------------------------------------------------------------
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'Fail' : 'Error';
        this.isOpertional = true;
        
    };
};

module.exports = ApiError;
