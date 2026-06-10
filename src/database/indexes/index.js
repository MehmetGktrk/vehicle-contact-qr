const { createUserIndexes } = require("./user.index");
const { createRefreshTokenIndexes } = require("./refreshToken.index");


async function createIndexes(db){

    console.log("[+] Creating indexes...");

    await createUserIndexes(db);
    await createRefreshTokenIndexes(db);

    console.log("[+] Indexes created");
}

module.exports = {
    createIndexes
}