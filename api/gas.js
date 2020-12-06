'use strict';

const request    = require('request-promise');
const logger     = require('../libs/logger');

class Gas {
    static async search(code) {
        logger.info(`gas query info: ${code}`);

        return await request({ method:'POST', uri: 'http://124.156.185.84:8000/ajax.php', form: { code, mode: 'normal' }});
    }
}

module.exports = Gas;
