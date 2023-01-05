const app = require('./config/express');
const { NODE_ENV, PORT } = require('./config/vars');

// TODO: console.log -> logger로 수정!
app.listen(PORT, () => {
    console.log(`[${NODE_ENV}] Server is running on PORT ${PORT}`);
});