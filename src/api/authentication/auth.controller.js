const authService = require('./auth.service');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../utils/cookieOptions');
const ApiError = require('../../utils/apiError');

exports.register = async(req, res, next) => {
    try {
        const { email, password, name, surname, phoneNumber } = req.body;

        const newUserId = await authService.register({ email, password, name, surname, phoneNumber});

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            newUserId: newUserId
        });
     } catch (err) {
        next(err);
    }
}


exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authService.login({ email, password });

        //Save refresh token to cookie
        setRefreshTokenCookie(res, user.refreshToken);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user.user,
            accessToken: user.accessToken,
        })
    } catch (err) {
        next(err);
    }
}


exports.refreshToken = async(req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if(!refreshToken){
            return next(new ApiError(401, 'NO_REFRESH_TOKEN', 'Refresh token not found'));
        }

        const tokens = await authService.refreshToken({ refreshToken });

        setRefreshTokenCookie(res, tokens.refreshToken);

        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            accessToken: tokens.accessToken,
        })
    } catch (err) {
        next(err);
    }
}


exports.logout = async(req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        await authService.logout({ refreshToken });

        clearRefreshTokenCookie(res);

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        })
    } catch (err) {
        if(err.code === 'EXPIRED_TOKEN' || err.code === 'INVALID_TOKEN'){
            clearRefreshTokenCookie(res);
            return res.status(200).json({
                success: true,
                message: 'Logout successful',
            })
        }

        next(err);
    }
}