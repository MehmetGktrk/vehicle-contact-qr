require("dotenv").config();

module.exports = {
    database: {
        uri: process.env.MONGO_URI,
        databaseName: process.env.DATABASE_NAME,
    },
    
    server: {
        port: process.env.PORT,
    }
}