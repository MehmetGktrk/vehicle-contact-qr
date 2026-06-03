const config = require('./config/config');
const { connectDB } = require('./database/connection');
const app = require('./app');


async function startServer() {
    try {
        await connectDB();


        app.listen(config.server.port, () => {
            console.log(`[+] Server is running on port ${config.server.port}`);
        })
    } catch (err) {
        console.error(`[-] Error starting server: ${err}`);
        process.exit(1);
    }
}


startServer();