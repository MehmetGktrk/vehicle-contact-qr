const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('./apiError');


function createToken(payload, type){
    let secret;
    let expiresIn;

    if(type === 'access'){
        secret = config.jwt.accessTokenSecret;
        expiresIn = config.jwt.accessTokenExpiresIn;
    }
    else if(type === 'refresh'){
        secret = config.jwt.refreshTokenSecret;
        expiresIn = config.jwt.refreshTokenExpiresIn;
    }
    else{
        throw new ApiError(400, 'INVALID_TOKEN_TYPE', 'Invalid token type');
    }

    const token = jwt.sign(
        payload,
        secret,
        { expiresIn: expiresIn }
    );

    return token;
}


function verifyToken(token, type){
    let secret;
    if(type === 'access'){
        secret = config.jwt.accessTokenSecret;
    }
    else if(type === 'refresh'){
        secret = config.jwt.refreshTokenSecret;
    }

    else{
        throw new ApiError(400, 'INVALID_TOKEN_TYPE', 'Invalid token type');
    }

    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        if(err.name === 'JsonWebTokenError'){
            throw new ApiError(401, 'INVALID_TOKEN', 'Invalid token');
        }
        if(err.name === 'TokenExpiredError'){
            throw new ApiError(401, 'EXPIRED_TOKEN', 'Expired token');
        }
        throw new ApiError(400, 'INVALID_TOKEN', 'Invalid token');
    }
}







module.exports = {
    createToken,
    verifyToken
}