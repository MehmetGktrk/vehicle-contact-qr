const config = require('./config/config');
const app = require('./app');


async function startServer() {
    try {
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        })
    } catch (err) {
        console.error(`Error starting server: ${err}`);
        process.exit(1);
    }
}


startServer();