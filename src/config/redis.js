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

const hSet = async (key, field, value, expireTime = null) => {
    await redisClient.hSet(key, field, value);   // key-value 설정
    if (expireTime !== null)
        await redisClient.expire(key, expireTime);   // expireTime 설정
};

module.exports = {
    connectRedis,
    hSet
};