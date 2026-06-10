require("dotenv").config();

module.exports = {

    environment: process.env.NODE_ENV,

    frontendUrl: process.env.FRONTEND_URL,
    
    database: {
        uri: process.env.MONGO_URI,
        databaseName: process.env.DATABASE_NAME,
    },
    
    server: {
        port: process.env.PORT,
    },

    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET,
        accessTokenExpiresIn: '24h',

        refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
        refreshTokenExpiresIn: '7d'
    }
}