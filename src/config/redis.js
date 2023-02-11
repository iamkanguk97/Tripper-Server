const redis = require('redis');
const Logger = require('./logger');
const { REDIS } = require('./vars');

const redisClient = redis.createClient({
    url: `redis://${REDIS.USERNAME}:${REDIS.PASSWORD}@${REDIS.HOST}:${REDIS.PORT}/0`,
    legacyMode: false,
});

redisClient.on('connect', () => {
    Logger.info('Success for Redis Connection!');
});
redisClient.on('error', (err) => {
    Logger.error('Error for Redis Connection!');
    Logger.error(err);
});

/**** Redis Util Function ****/
const connectRedis = async () => {
    await redisClient.connect();
};

const set = async (key, value) => {
    await redisClient.set(key, value);
};

const hSet = async (key, field, value) => {
    await redisClient.hSet(key, field, value);
};

module.exports = {
    connectRedis,
    set,
    hSet
};