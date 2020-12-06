'use strict';

const request = require('request-promise');
const logger  = require('../libs/logger');

class Zuan {
    static async query(seq) {
        logger.info(`zuan query seq: ${seq}`);

        let uri = 'https://zuan.wcnm.workers.dev/';

        return await request({ method: 'GET', uri });
    }
}

module.exports = Zuan;
