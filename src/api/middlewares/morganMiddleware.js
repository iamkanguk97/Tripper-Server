const morgan = require('morgan');
const Logger = require('../../config/logger');
const { NODE_ENV } = require('../../config/vars');

const format = () => (NODE_ENV === 'production' ? 'combined' : 'common');

const stream = {
    write: message => Logger.http(message)
};

const skip = (_, res) => {
    if (NODE_ENV === 'production') {
        return res.statusCode < 400;
    }
    return false;
};

const morganMiddleware = morgan(format(), { stream, skip });

module.exports = morganMiddleware;
