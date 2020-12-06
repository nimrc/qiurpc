'use strict';

const path     = require('path');
const admin    = require('./admin');
const redis    = require('./redis');
const database = require('./database');
const tuling   = require('./tuling');


const root_path = path.normalize(path.join(__dirname, '../'));
const log_path  = path.join(root_path, 'logs');

module.exports = {
    root_path,
    log_path,
    admin,
    redis,
    database,
    tuling
};
