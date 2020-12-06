'use strict';

const logger = require('../libs/logger');

module.exports = async ({ msg, bot, msgType }, next) => {
    const { Content, FromUserName } = msg;

    if ('fmessage' === FromUserName) {
        bot.verifyUser(msg.RecommendInfo.UserName, msg.RecommendInfo.Ticket).then(res => {
            logger.info(`[NewFriend] 通过了 ${bot.Contact.getDisplayName(msg.RecommendInfo)} 好友请求`);

            bot.sendMsg('客官，等你很久了！感谢跟小秋交朋友', mgs.RecommendInfo.UserName);
        }).catch(err => {
            bot.emit('error', err);
        });
    }

    if (Content.match(/加入了群聊|移出了群聊|改群名为|移出群聊|邀请你|分享的二维码加入群聊/)) {
        logger.info(`send greeter to ${FromUserName}`);

        bot.sendMsg('大家好，我是萌萌的小秋~', FromUserName);
    }

    await next();
};
