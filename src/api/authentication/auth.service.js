const authRepository = require('./auth.repository');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ApiError = require('../../utils/apiError');
const { createToken, verifyToken } = require('../../utils/jwtToken');


exports.register = async({ email, password, name, surname, phoneNumber }) => {
    const user = await authRepository.getUserByEmail(email);

    if(user){
        throw new ApiError(400, 'EMAIL_ALREADY_IN_USE', 'Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        email: email,
        password: hashedPassword,
        role: 'user',
        name: name,
        surname: surname,
        phoneNumber: phoneNumber
    };

    const newUserId = await authRepository.createUser(userData);

    return newUserId;
}


exports.login = async({ email, password }) => {
    const user = await authRepository.getUserByEmail(email);

    if(!user){
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const jti = crypto.randomUUID();
    const familyId = crypto.randomUUID();

    const payload = {
        userId: user._id.toString(),
        role: user.role,
    }

    const accessToken = createToken(payload, 'access');
    const refreshToken = createToken({ ...payload, jti: jti }, 'refresh');

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Save refresh token to database
    await authRepository.createRefreshToken(user._id.toString(), hashedRefreshToken, jti, familyId);


    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role,
        }
    }
}


exports.refreshToken = async({ refreshToken }) => {

    const decoded = verifyToken(refreshToken, 'refresh');

    const dbRefreshToken = await authRepository.getRefreshTokenByJti(decoded.jti);

    if(!dbRefreshToken){
        throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token');
    }

    const user = await authRepository.getUserByID(dbRefreshToken.userId.toString());

    if(!user){
        throw new ApiError(401, 'USER_NOT_FOUND', 'User not found');
    }

    if(dbRefreshToken.isRevoked){
        // Revoke all tokens by family id
        await authRepository.revokeAllTokensByFamilyId(dbRefreshToken.familyId);
        throw new ApiError(401, 'TOKEN_REUSE_DETECTED', 'Token reuse detected');
    }

    // Check if refresh token is expired in database
    if( new Date() > dbRefreshToken.expiresAt){
        throw new ApiError(401, 'EXPIRED_REFRESH_TOKEN', 'Expired refresh token');
    }

    // Check if refresh token is valid with compare in database
    const isRefreshTokenValid = await bcrypt.compare(refreshToken, dbRefreshToken.token);

    if(!isRefreshTokenValid){
        throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token');
    }

    // Revoke refresh token in database
    const revokedCount = await authRepository.revokeRefreshTokenByID(dbRefreshToken._id);

    if(revokedCount === 0){
        throw new ApiError(500, 'FAILED_TO_REVOKE_TOKEN', 'Failed to revoke token');
    }


    //Create new access token
    const newJti = crypto.randomUUID();

    const payload = {
        userId: user._id.toString(),
        role: user.role,
    }
    const newAccessToken = createToken(payload, 'access');
    const newRefreshToken = createToken({ ...payload, jti: newJti }, 'refresh');

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    // Save refresh token to database
    await authRepository.createRefreshToken(dbRefreshToken.userId, hashedRefreshToken, newJti, dbRefreshToken.familyId);

    return {    
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}


exports.logout = async({ refreshToken }) => {

    if(!refreshToken){
        return true;
    }

    const decoded = verifyToken(refreshToken, 'refresh');

    const dbRefreshToken = await authRepository.getRefreshTokenByJti(decoded.jti);

    if(dbRefreshToken && !dbRefreshToken.isRevoked){
        await authRepository.revokeRefreshTokenByID(dbRefreshToken._id);
    }

    return true;
}


