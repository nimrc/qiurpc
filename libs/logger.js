'use strict';

const log4js       = require('log4js');
const path         = require('path');
const { log_path } = require('../config');

log4js.configure({
    appenders        : {
        out         : {
            type  : 'console',
            layout: {
                type   : 'pattern',
                pattern: `[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%[%p%]] %c - %m`
            }
        },
        default     : {
            type                : 'dateFile',
            filename            : path.join(log_path, 'application.log'),
            pattern             : '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            layout              : {
                type   : 'pattern',
                pattern: `[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%[%p%]] %c - %m`
            }
        },
        record_error: {
            type                : 'dateFile',
            filename            : path.join(log_path, 'application-wf.log'),
            pattern             : '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            layout              : {
                type   : 'pattern',
                pattern: `[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%[%p%]] %c - %m`
            }
        },
        error       : {
            type    : 'logLevelFilter',
            appender: 'record_error',
            level   : 'error'
        },
        access      : {
            type                : 'dateFile',
            filename            : path.join(log_path, 'access.log'),
            pattern             : '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            layout              : {
                type   : 'pattern',
                pattern: `[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%[%p%]] %c - %m`
            }
        }
    },
    categories       : {
        default: { appenders: ['out', 'default', 'error'], level: 'all' },
        access : { appenders: ['out', 'access'], level: 'all' }
    },
    pm2              : true,
    pm2InstanceVar   : 'INSTANCE_ID',
    disableClustering: true
});

/**
 * @var {Logger} logger
 * */
module.exports = log4js.getLogger();
