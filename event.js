'use strict';

const redis = require('./libs/redis');
const logger = require('./libs/logger');

module.exports = ({request: {event, data}}, cb) => Promise.resolve((async (event, data, cb) => {
    if (event === 'contact') {
        data = JSON.parse(data);

        let nickname = data['NickName'] || '';
        let username = data['UserName'];

        logger.info(`[Event] ${event} ${nickname}: ${username}`);

        await redis.set(`id:${username}`, nickname);
        await redis.expire(`id:${username}`, 7 * 86400);

        cb(null, {});
    }

})(event, data, cb));
