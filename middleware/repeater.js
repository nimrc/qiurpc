'use strict';
const redis             = require('../libs/redis');
const logger            = require('../libs/logger');
const util              = require('../libs/util');
const { admin }         = require('../config');
const { emoticons_key } = require('../const/redis_keys');

module.exports = async ({ request }, cb, next) => {
    const { fromUser, fromType, isAt, msgType, pure } = request;

    if (msgType === 'text') {
        if (fromType === 'Friend' || isAt) {
            let text = '';

            if (pure.match(/^\[(.+?)]$/)) {
                text = pure;
            } else if (pure.indexOf('抵制') >= 0) {
                text = `${pure}!`;
            } else if (pure.indexOf('加油') >= 0) {
                text = `${pure}!`;
            }

            if (text !== '')
                cb(null, { toUser: fromUser, body: { text } });
            else
                await next();
        }
    }
};
