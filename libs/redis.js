'use strict';

const Redis    = require('redis');
const bluebird = require('bluebird');
const logger   = require('./logger');
const config   = require('../config');
const { list } = require('redis-commands');


bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

const { port, host, options, auth } = config.redis;

let client = Redis.createClient({
    port, host, options, retry_strategy: options => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return new Error(' connect the server failed');
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});


if (typeof auth === 'string') {
    client.auth(auth, (err, result) => {
        logger.info('redis auth: ', result);
    });
}

list.map(command => client[command] = bluebird.promisify(client[command]));

module.exports = client;
