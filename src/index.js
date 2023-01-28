const app = require('./config/express');
const Logger = require('./config/logger');
const { NODE_ENV, PORT } = require('./config/vars');

app.listen(PORT, () => {
    Logger.info(`[${NODE_ENV}] Server is running on PORT ${PORT}`);
});