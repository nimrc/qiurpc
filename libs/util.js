'use strict';

const FROM_TYPE_SYSTEM   = 'System';
const FROM_TYPE_SELF     = 'Self';
const FROM_TYPE_GROUP    = 'Group';
const FROM_TYPE_FRIEND   = 'Friend';
const FROM_TYPE_OFFICIAL = 'Official';
const FROM_TYPE_SPECIAL  = 'Special';
const FROM_TYPE_UNKNOWN  = 'Unknown';

class Util {
    static parse(msg) {
        return {
            parse   : Util.parseMsg(msg),
            msgType : Util.getMsgType(msg),
            fromType: Util.getMsgFromType(msg),
            md5     : Util.getEmoticonMd5(msg)
        };
    }

    static parseMsg({ Content }) {
        let isAt = false;

        let matched = Content.match(/^@(.+?)\s([\s\S]*)/);
        let pure    = matched ? matched[2] : Content;

        const { NickName } = bot.user;

        if (Content.indexOf(`@${NickName}`) >= 0) {
            isAt = true;
        }

        return { isAt, pure };
    }

    static getEmoticonMd5({ Content }) {
        let matched = Content.match(/md5="(.*?)"/);

        if (matched && Util.isValidMd5(matched[1]))
            return matched[1];

        return null;
    }

    static getMsgType({ MsgType }) {
        const { CONF } = bot;
        const types    = {
            [CONF.MSGTYPE_TEXT]        : 'text',
            [CONF.MSGTYPE_EMOTICON]    : 'emoticon',
            [CONF.MSGTYPE_APP]         : 'emotion',
            [CONF.MSGTYPE_STATUSNOTIFY]: 'status'
        };

        return types[MsgType] || 'unknown';
    }

    static getMsgFromType(msg) {
        const { FromUserName } = msg;

        if (Util.getMsgType(msg) === 'status')
            return FROM_TYPE_SYSTEM;

        if (FromUserName.indexOf('@@') >= 0)
            return FROM_TYPE_GROUP;

        if (bot.contacts[FromUserName].getDisplayName())
            return FROM_TYPE_FRIEND;

        return FROM_TYPE_UNKNOWN;
    }

    static isValidMd5(string) {
        return string.match(/^[a-f0-9]{32}$/);
    }
}

module.exports = Util;
