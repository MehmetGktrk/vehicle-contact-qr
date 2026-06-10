const { ObjectId } = require("mongodb");
const { getDB } = require("../../database/connection");
const ms = require("ms");
const config = require("../../config/config");

exports.getUserByEmail = async(email) => {
    const db = getDB();
    
    const user = await db.collection('users').findOne({ email: email});

    return user;
}


exports.getUserByID = async(id) => {
    const db = getDB();

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    return user;
}

exports.createUser = async (userData) => {
    const db = getDB();

    const user = await db.collection('users').insertOne(userData);

    return user.insertedId;
}


exports.getRefreshTokenByJti = async(jti) => {
    const db = getDB();
    
    const refreshToken = await db.collection('refresh_tokens').findOne({ jti: jti });

    return refreshToken;
}


exports.createRefreshToken = async(userId, token, jti, familyId) => {
    const db = getDB();

    const expiresAt = new Date(Date.now() + ms(config.jwt.refreshTokenExpiresIn));

    const refreshToken = await db.collection('refresh_tokens').insertOne({
        userId: userId,
        token: token,
        familyId: familyId,
        jti: jti,
        createdAt: new Date(),
        expiresAt: expiresAt,
        isRevoked: false
    });

    return refreshToken.insertedId;
}


exports.revokeRefreshTokenByID = async(id) => {
    const db = getDB();

    const updateRevoke = await db.collection('refresh_tokens').updateOne({
        _id: id
    }, {
        $set: {
            isRevoked: true,
            revokedAt: new Date()
        }
    });

    return updateRevoke.modifiedCount;
}


exports.revokeAllTokensByFamilyId = async(familyId) => {
    const db = getDB();

    const updateRevoke = await db.collection('refresh_tokens').updateMany({
        familyId: familyId
    }, {
        $set: {
            isRevoked: true,
            revokedAt: new Date()
        }
    });

    return updateRevoke.modifiedCount;
}