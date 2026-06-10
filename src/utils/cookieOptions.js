const ms = require('ms');
const config = require('../config/config');


function setRefreshTokenCookie(res, refreshToken){
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.environment === 'production',
        maxAge: ms(config.jwt.refreshTokenExpiresIn),
        sameSite: 'strict',
        path: '/api/auth'
    })
}


function clearRefreshTokenCookie(res){
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'strict',
        path: '/api/auth',
    });
}


module.exports = {
    setRefreshTokenCookie,
    clearRefreshTokenCookie
}