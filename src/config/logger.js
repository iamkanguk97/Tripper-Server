const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, printf, colorize } = winston.format;
const { NODE_ENV } = require('./vars');

const logDirectory = 'logs'; // log 저장 디렉토리

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

winston.addColors(colors);

const level = () => {
    const isDevelopment = NODE_ENV !== 'production';
    return isDevelopment ? 'debug' : 'http';
};

// Log Format
const logFormat = combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:ms'
    }),
    printf(info => {
        if (info.stack) {
            return `${info.timestamp} ${info.level}: ${info.message} \n Error Stack: ${info.stack}`;
        }
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })
);

const consoleOption = {
    handleExceptions: true,
    level: NODE_ENV === 'production' ? 'error' : 'debug',
    format: combine(
        colorize({
            all: true
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss:ms'
        })
    )
};

const _transports = [
    new winston.transports.Console(consoleOption), // 콘솔 로그 찍을때만 색깔 추가

    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(__dirname, '../', logDirectory, '/error'),
        filename: '%DATE%.error.log',
        maxFiles: 30,
        zippedArchive: true
    }),
    // 모든 레벨 로그를 저장할 파일 설정
    new winstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(__dirname, '../', logDirectory, '/all'),
        filename: '%DATE%.all.log',
        maxFiles: 7,
        zippedArchive: true
    })
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports: _transports
});

module.exports = logger;
