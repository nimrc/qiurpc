'use strict';

const request = require('request-promise');
const logger  = require('../libs/logger');
const redis   = require('../libs/redis');
const moment  = require('moment');

const WUHAN_DATE = 20200123;

class Wuhan {
    static async query() {
        let data = await redis.get('wuhan:data');

        if (data === null) {
            logger.info(`query wuhan feiyan`);

            data = await request({
                method : 'GET',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36'
                },
                uri    : 'https://c.m.163.com/ug/api/wuhan/app/data/list-total?t=' + (new Date()).getTime()
            });

            await redis.set('wuhan:data', data);
            await redis.expire('wuhan:data', 60);
        }

        data = JSON.parse(data);

        let map = {
            "封城": moment().diff(moment(WUHAN_DATE, 'YYYYMMDD'), 'days')
        };

        if (data["code"] === 10000) {

            let set = (item) => {
                map[item["name"]] = item;

                item.children.map(set);
            };

            data["data"]["areaTree"].map(set);
        }

        return map;
    }
}

module.exports = Wuhan;
