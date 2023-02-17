const redis = require('redis');
const Logger = require('./logger');
const { REDIS } = require('./vars');

class RedisClient {
    constructor() {
        this.redisClient = redis.createClient({
            url: `redis://${REDIS.USERNAME}:${REDIS.PASSWORD}@${REDIS.HOST}:${REDIS.PORT}/0`,
            legacyMode: false,
        });

        this.redisClient.on('connect', () => {
            Logger.info('Success for Redis Connection!');
        });
        this.redisClient.on('error', (err) => {
            Logger.error('Error for Redis Connection!');
            Logger.error(err);
        });
    }

    // RedisClient에 연결
    async connect() {
        await this.redisClient.connect();
    }

    // Redis hSet
    async hSet(key, field, value, expireTime = null) {
        await this.redisClient.hSet(key, field, value);   // key-value 설정
        if (expireTime !== null)
            await this.redisClient.expire(key, expireTime);   // expireTime 설정
    }

    // RedisClient 연결 끊기
    async disconnect() {
        Logger.info('Success for disconnecting Redis!');
        await this.redisClient.disconnect();
    }
}

module.exports = RedisClient;