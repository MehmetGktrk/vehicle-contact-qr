const config = require('./config/config');
const { connectDB, getDB } = require('./database/connection');
const app = require('./app');
const { createIndexes } = require('./database/indexes');


async function startServer() {
    try {
        await connectDB();
        await createIndexes(getDB());

        app.listen(config.server.port, () => {
            console.log(`[+] Server is running on port ${config.server.port}`);
        })
    } catch (err) {
        console.error(`[-] Error starting server: ${err}`);
        process.exit(1);
    }
}


startServer();