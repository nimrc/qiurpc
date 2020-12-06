'use strict';

const redis = require('../libs/redis');
const logger = require('../libs/logger');
const util = require('../libs/util');
const { emoticons_key } = require('../const/redis_keys');

module.exports = async ({ request }, cb, next) => {
    let admin = await redis.get('admin:id');

    const { md5, fromUser, msgType, pure } = request;

    let send = false;

    if (fromUser === admin) {
        // 添加表情
        if (msgType === 'emoticon' && util.isValidMd5(md5)) {
            logger.info(`Add new emoticon: ${md5}`);

            await redis.sadd(emoticons_key, md5);

            send = true;
            cb(null, { toUser: fromUser, body: { text: `添加新表情 ${md5}` } });
        }

        // 删除表情
        if (pure && util.isValidMd5(pure)) {
            logger.info(`Remove emoticon ${pure}`);

            await redis.srem(emoticons_key, pure);

            send = true;
            cb(null, { toUser: fromUser, body: { text: `已删除表情 ${pure}` } });
        }

        // ping/pong
        if (msgType === 'text' && pure === 'PING') {
            send = true;
            cb(null, { toUser: fromUser, body: { text: 'PONE' } });
        }

        // ping/pong
        if (msgType === 'text' && pure === 'PPING') {
            send = true;
            cb(null, { toUser: fromUser, body: { text: 'PONE' } });
        }
    }

    if (send === false)
        await next();
};
