
async function createUserIndexes(db){
    const collection = db.collection('users');

    await collection.createIndex({ email: 1 }, { unique: true });

    console.log("[+] User indexes created");
}


module.exports = {
    createUserIndexes
}