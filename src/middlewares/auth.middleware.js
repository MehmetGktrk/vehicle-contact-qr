const ApiError = require('../utils/apiError');
const { verifyToken } = require('../utils/jwtToken');


function authMiddleware(req, res, next){
    
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(new ApiError(401, 'UNAUTHORIZED', 'Unauthorized'));
    }
    
    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token, 'access');
    req.user = decoded;
    next();
}


module.exports = authMiddleware;