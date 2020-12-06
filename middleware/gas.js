'use strict';

const gas    = require('../api/gas');
const logger = require('../libs/logger');
const redis  = require('../libs/redis');

module.exports = async ({ request }, cb, next) => {
    const { pure, fromUser, fromType, msgType, isAt } = request;

    let text = null;

    if (msgType === 'text') {
        if (fromType === 'Friend' || isAt) {
            if (pure.match(/\w+-\d+/g)) {
                text = await redis.get(pure);

                if (text === null) {
                    text = await gas.search(pure);

                    await redis.set(pure, text);
                }
            }

            if (pure === '#') {
                text = await gas.search(pure);
            }

            if (text)
                cb(null, { toUser: fromUser, body: { text } });
        }
    }

    if (text === null)
        await next();
};
