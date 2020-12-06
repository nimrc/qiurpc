'use strict';

const request    = require('request-promise');
const { tuling } = require('../config');
const logger     = require('../libs/logger');

class Tuling {
    static async search(info) {
        const { api: uri, key } = tuling;

        logger.info(`tuling query info: ${info}`);

        return await request({ method: 'POST', uri, body: { key, info }, json: true });
    }
}

module.exports = Tuling;
