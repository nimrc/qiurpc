'use strict';

const Wuhan = require('../api/wuhan');
const util  = require('util');

module.exports = async ({ request }, cb, next) => {
    const { fromUser, fromType, isAt, msgType, pure } = request;

    if (msgType === 'text') {
        if (fromType === 'Friend' || isAt) {
            let text = '';

            let matched = pure.match(/疫情|确诊|病人|新冠|肺炎/);

            if (matched) {
                let data = await Wuhan.query();
                let days = data['封城'];

                let msg = data => {
                    let total = data['total'];
                    let today = data['today'];

                    return util.format(`【疫情动态】%s：总确诊: %d, 疑似: %d, 治愈: %d, 死亡: %d, 今日新确诊: %d, 武汉已封城: %d天`,
                        data['name'], total['confirm'], total['suspect'], total['heal'], total['dead'], today['confirm'], days
                    );
                };

                let city = pure.split('确诊')[0];

                if (data[city] !== undefined) {
                    text = msg(data[city]);
                } else {
                    text = msg(data['中国']);
                }
            }

            if (text !== '')
                cb(null, { toUser: fromUser, body: { text } });
            else
                await next();
        }
    }
};
