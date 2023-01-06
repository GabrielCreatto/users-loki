import winston from 'winston';
import LokiTransport from 'winston-loki';

const logger = winston.createLogger({
    transports: [
        new LokiTransport({
            host: process.env.LOKI_HOST!,
            json: true,
            format: winston.format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error(err)
        }),
        new winston.transports.Console({
            format: winston.format.combine(winston.format.simple(), winston.format.colorize())
        })
    ],
});

export default logger;