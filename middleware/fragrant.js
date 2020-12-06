'use strict';

const Nmsl = require('../api/nmsl');
const redis = require('../libs/redis');
const logger = require('../libs/logger');

module.exports = async ({request}, cb, next) => {
    const {fromUser, fromType, isAt, msgType, pure} = request;

    let text = '';
    let exists = await redis.sismember('fragrant', fromUser);
    let open = await redis.sismember('fragrant:close', fromUser);
    let count = await redis.hget('fragrant:count', fromUser) || 0;

    if (msgType === 'text') {
        if (fromType === 'Friend' || isAt) {
            if (exists) {
                let level = count > 3 ? 'full' : 'min';
                text = await Nmsl.query(level);

                logger.info(`[Send] ${fromUser}: ${text}`);

                await redis.hincrby('fragrant:count', fromUser, 1);
                await redis.expire('fragrant:count', 600);

                cb(null, {toUser: fromUser, body: {text}});
            }

            if (pure === '收声') {
                await redis.del('fragrant');
                await redis.del('fragrant:count');

                cb(null, {toUser: fromUser, body: {text: '明白了. 我收拾一下就滚'}});
            }


            if (pure === '口吐芬芳') {
                await redis.sadd('fragrant', fromUser);

                cb(null, {toUser: fromUser, body: {text: '对线?'}});
            }

            if (pure.indexOf('火力全开') > 0) {
                await redis.hincrby('fragrant:count', fromUser, 10);
                await redis.sadd('fragrant', fromUser);

                cb(null, {toUser: fromUser, body: {text: '牛逼还是你牛逼'}});
            }

        }
    } else if (exists && count > 300) {
        let level = 'min';
        text = await Nmsl.query(level);

        logger.info(`[Send ext] ${fromUser}: ${text}`);

        cb(null, {toUser: fromUser, body: {text}});
    }

    if (text === '')
        await next();
};
