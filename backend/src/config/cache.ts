import { RedisOptions } from 'ioredis';

interface ICacheConfig {
    driver: 'redis';

    config: {
        redis: RedisOptions;
    }
}

export default {
    driver: 'redis',

    config: {
        redis: {
            host: 'localhost',
           //host: process.env.REDIS_HOST,
            port: 6379,
            //port: process.env.REDIS_PORT,
            password: undefined,
            //password: process.env.REDIS_PASS || undefined,
        },
    },
} as ICacheConfig;
