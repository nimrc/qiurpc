'use strict';

const mysql = require('mysql2');
const logger = require('../libs/logger');
const util = require('util');
const { database } = require('../config');

class Mysql {
    constructor() {
        this.conn = mysql.createConnection(database);
    }

    addChatlog(recv, send, to) {
        let sql = "INSERT INTO `chatlog` ( `recv`, `send`, `to`) VALUES ( '%s', '%s', '%s');";

        sql = util.format(sql, recv, send, to);

        logger.debug("[Query Debug]", sql);

        return new Promise(resolve => {
            this.conn.query(sql, (err ,res) => {
                resolve(res);
            });
        });
    }
}

module.exports = Mysql;
