'use strict';

const Zuan   = require('../api/zuan');
const redis  = require('../libs/redis');
const logger = require('../libs/logger');

module.exports = async ({ request }, cb, next) => {
    const { fromUser, fromType, isAt, msgType, pure } = request;

    let text  = '';
    let level = await redis.get('fragrant:level') || 0;

    if (msgType === 'unknown' && pure.indexOf('拍了拍我') > 0) {
        text = await Zuan.query();

        logger.info(`[Send] ${fromUser}: ${text}`);
        cb(null, { toUser: fromUser, body: { text }, multi: true });
    }

    if (msgType === 'text') {
        if (fromType === 'Friend' || isAt) {
            if (level && pure === '加特林') {
                let texts = [];

                for (let i = 0; i < level; i++) {
                    text = await Zuan.query(i);
                    texts.push(text);
                }

                text = texts.join('|');

                logger.info(`[Send] ${fromUser}: ${text}`);

                cb(null, { toUser: fromUser, body: { text }, multi: true });
            }
        }
    }

    if (text === '')
        await next();
};
