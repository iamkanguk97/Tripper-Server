const redis = require('redis');
const Logger = require('./logger');
const { REDIS } = require('./vars');

class RedisClient {
    constructor() {
        this.setRedis();
    }

    setRedis() {
        this.setRedisClient();
        
        this.redisClient.on('connect', this.connectMessageHandler);
        this.redisClient.on('error', this.errorMessageHandler);
        this.redisClient.on('end', this.quitMessageHandler);
    }

    setRedisClient() {
        this.redisClient = redis.createClient({
            url: `redis://${REDIS.USERNAME}:${REDIS.PASSWORD}@${REDIS.HOST}:${REDIS.PORT}/0`,
            legacyMode: false,
        });
    }

    connectMessageHandler() {
        Logger.info('### Success for Redis Connection! ###');
    }
    errorMessageHandler(err) {
        Logger.error('### Redis Connection Error! >> ###', err);
    }
    quitMessageHandler() {
        Logger.info('### Redis Connection Close! ###');
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

    // Redis hGet
    async hGet(key, field) {
        return await this.redisClient.hGet(key, field);
    }

    // Redis hGetAll
    async hGetAll(key) {
        return await this.redisClient.hGetAll(key);
    }

    // RedisClient 연결 끊기
    quit() {
        this.redisClient.quit();
    }
}

module.exports = RedisClient;