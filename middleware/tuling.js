'use strict';

const tuling = require('../api/tuling');
const logger = require('../libs/logger');
const redis  = require('../libs/redis');
const Mysql  = require('../libs/mysql');

const db = new Mysql();

module.exports = async ({ request }, cb, next) => {
    const { pure, fromUser, fromType, msgType, isAt } = request;

    if (msgType === 'text') {
        if (fromType === 'Friend' || isAt) {
            const date = `${(new Date()).getMonth() + 1}${(new Date()).getDate()}`;

            let count = await redis.hget('robot:count', date) || 0;

            let { text } = await tuling.search(pure);

            if (text.indexOf('请求次数') > 0) {
                text = '小秋已打烊，客官您明天再来~';

                logger.info(`reach daily limit: ${text}`);
            }

            logger.info(`[Send] ${fromUser}: ${text}`);

            await db.addChatlog(pure, text, fromUser);

            cb(null, { toUser: fromUser, body: { text } });

            await redis.hincrby('robot:count', date, 1);
        }
    }

    await next();
};
