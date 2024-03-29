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
            socket: {
                host: REDIS.HOST,
                port: REDIS.PORT
            },
            db: REDIS.DATABASE,
            password: REDIS.PASSWORD,
            legacyMode: false
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
        await this.redisClient.hSet(key, field, value); // key-value 설정
        if (expireTime !== null) await this.redisClient.expire(key, expireTime); // expireTime 설정
    }

    // Redis hGet
    async hGet(key, field) {
        const result = await this.redisClient.hGet(key, field);
        return result;
    }

    // Redis hGetAll
    async hGetAll(key) {
        const result = await this.redisClient.hGetAll(key);
        return result;
    }

    // RedisClient 연결 끊기
    async quit() {
        await this.redisClient.quit();
    }

    // Redis hDel
    async hDel(key, field) {
        await this.redisClient.hDel(key, field);
    }
}

module.exports = RedisClient;
