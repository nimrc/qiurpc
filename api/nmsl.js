'use strict';

const request = require('request-promise');
const logger  = require('../libs/logger');

class Nmsl {
    static async query(level) {
        logger.info(`nmsl query level: ${level}`);

        let uri = 'https://zuanbot.com/api.php';

        if (level === 'min')
            uri += '?level=min&lang=zh_cn';

        let headers = {
            authority: 'zuanbot.com',
            referer  : 'https://zuanbot.com/'
        };

        return await request({ method: 'GET', uri, headers });
    }
}

module.exports = Nmsl;
