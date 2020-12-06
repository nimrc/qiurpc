'use strict';

const admin = require('./admin');
const emoticon = require('./emoticon');
const tuling = require('./tuling');
const repeater = require('./repeater');
const wuhan = require('./wuhan');
const gas = require('./gas');
const fragrant = require('./fragrant');
const zuan = require('./zuan');
const logger = require('../libs/logger');

const compose = middleware => {
    return function (ctx, cb, next) {
        logger.info(JSON.stringify(ctx.request));

        let index = -1;
        return dispatch(0);

        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();

            let callback = (err, res) => {
                logger.info("[Send]", JSON.stringify(res));

                cb(err, res);
            };

            try {
                return Promise.resolve(fn(ctx, callback, dispatch.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
};

module.exports = compose([
    admin,
    emoticon,
    gas,
    fragrant,
    zuan,
    tuling,
    repeater,
    wuhan
]);
