function errorMiddleware(err, req, res, next){
    const statusCode = err.statusCode || 500;

    if(!err.isOperational){
        console.error(err);
    }

    const response = {
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'Internal Server Error',
        }
    };

    return res.status(statusCode).json(response);
}

module.exports = errorMiddleware;