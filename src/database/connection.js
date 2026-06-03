const { MongoClient  } = require("mongodb");
const config = require("../config/config");


let dbClient = null;
let dbInstance = null;

async function connectDB() {
    if(!dbClient){
        try {
            const client = new MongoClient(config.database.uri);

            await client.connect();

            dbClient = client;
            dbInstance = client.db(config.database.databaseName);
            console.log("[+] Connected to MongoDB");
        } catch (err) {
            console.error(`[-] Error connecting to MongoDB: ${err}`);
            process.exit(1);
        }
    }
    return dbInstance;
}

function getDB(){
    if(!dbInstance){
        throw new Error("❌ Database Not Connected, Call connectToDatabase first");
    };

    return dbInstance;
}


module.exports = {
    connectDB,
    getDB,
}