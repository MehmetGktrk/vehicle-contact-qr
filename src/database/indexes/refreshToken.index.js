
async function createRefreshTokenIndexes(db){
    const collection = db.collection('refresh_tokens');

    await collection.createIndex({ jti: 1 }, { unique: true });
    await collection.createIndex({ familyId: 1 });
    await collection.createIndex({ userId: 1});
    
    //delete the token after it expires
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    console.log("[+] Refresh token indexes created");
}


module.exports = {
    createRefreshTokenIndexes
}