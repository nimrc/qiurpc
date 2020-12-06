'use strict';

const zuan = require('./api/nmsl');

(async () => {
    let res = await zuan.query('max');

    console.log(res);
})();
