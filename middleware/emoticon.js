'use strict';

const logger            = require('../libs/logger');
const redis             = require('../libs/redis');
const moment            = require('moment');
const { emoticons_key } = require('../const/redis_keys');

module.exports = async ({ request }, cb, next) => {
    const { fromUser, msgType } = request;

    if (msgType === 'emoticon') {
        const emoticonMd5 = await redis.srandmember(emoticons_key);

        logger.info(`[Send ${moment().format('mm:ss')}] (${fromUser}): ${msgType} md5="${emoticonMd5}"`);

        cb(null, { toUser: fromUser, body: { emoticonMd5 } });
    }

    await next();
};
