var express = require('express');
var pool = require('../config/connection.js');

module.exports.GetLoginUser = function (user_id, callback) {
    pool.query('SELECT * FROM users WHERE id=' + user_id, function (err, result) {
        if (err)
            console.log(err);
        else
            callback(result);
    });
};

module.exports.GetOnlineUser = function (user_id, callback) {
    pool.query('SELECT id, name, user_id, logindatetime, loginstatus, MAX(logindatetime) max_date FROM onlineusers_history where user_id=' + user_id + ' and loginstatus=1 GROUP BY id order by id desc limit 1', function (err, result) {
        if (err)
            console.log(err);
        else
            callback(result);
    });
};

module.exports.SaveOnlineUser = function (UserDetail, callback) {
    pool.query('INSERT INTO onlineusers_history SET ?', [UserDetail], function (err, result) {
        if (err)
            console.log(err);
        else {
            callback(result);
        }
    });
};

module.exports.GetAllTotalOnlineUsers = function (callback) {
    //SELECT id, name, user_id, logindatetime, loginstatus, usericon_color, MAX(logindatetime) max_date FROM onlineusers_history where loginstatus=1 GROUP BY id order by id desc
    //SELECT u.username as name, u.usericon_color, uh.* FROM users u JOIN onlineusers_history uh ON u.id = uh.user_id where uh.loginstatus=1 GROUP BY uh.id order by uh.id desc
    pool.query('SELECT u.username as name, u.usericon_color, uh.* FROM users u JOIN onlineusers_history uh ON u.id = uh.user_id where uh.loginstatus=1 GROUP BY uh.id order by uh.id desc', function (err, result) {
        if (err)
            console.log(err);
        else {
            callback(result);
        }
    });
};

module.exports.UpdateOnlineUser = function (id, callback) {
    pool.query('UPDATE onlineusers_history SET loginstatus = ?, logoutDateTime = ? WHERE id = ?',
      [0, new Date(), id] ,
        function (err) {
        if (err)
            console.log(err);
        else
            callback(id);
    });
};

module.exports.InsertGroupChatMessage = function (MsgDetail, callback) {
    pool.query('INSERT INTO chat_messages SET ?', [MsgDetail], function (err, result) {
        if (err)
            console.log(err);
        else {
            callback(result);
        }
    });
};

module.exports.GetAllGroupChatMessage = function (firstid, callback) {
    //SELECT * FROM ( SELECT * FROM table ORDER BY id DESC LIMIT 50) sub ORDER BY id ASC
    if (firstid == null) {
        pool.query('SELECT * FROM (SELECT u.username as name, u.usericon_color, cm.* FROM users u JOIN chat_messages cm ON u.id = cm.sender_id where cm.message_type="msgPublic" ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC',//'SELECT * FROM ( SELECT * FROM chat_messages ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC',// ORDER BY id DESC',
	function (err, result) {
            if (err)
                console.log(err);
            else
                callback(result);
        });
    }
    else {
        pool.query('SELECT * FROM (SELECT u.username as name, u.usericon_color, cm.* FROM users u JOIN chat_messages cm ON u.id = cm.sender_id where cm.message_type="msgPublic" and cm.id<' + firstid + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC',// ORDER BY id DESC',
	function (err, result) {
            if (err)
                console.log(err);
            else
                callback(result);
        });
    }
};

module.exports.GetUserPrivateChatMessage = function (chatData, firstid, callback) {
    if (firstid == null) {
        pool.query('SELECT * FROM (SELECT u.username as name, u.usericon_color, cm.* FROM users u JOIN chat_messages cm ON u.id=cm.sender_id where cm.sender_id IN (' + chatData.sId + ',' + chatData.rId + ') and cm.receiver_id IN (' + chatData.sId + ',' + chatData.rId + ') and cm.message_type="msgPrivate" ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC',
	function (err, result) {
            if (err)
                console.log(err);
            else
                callback(result);
        });
    }
    else {
        pool.query('SELECT * FROM (SELECT u.username as name, u.usericon_color, cm.* FROM users u JOIN chat_messages cm ON u.id = cm.sender_id where cm.message_type="msgPublic" and cm.id<' + firstid + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC',
	function (err, result) {
            if (err)
                console.log(err);
            else
                callback(result);
        });
    }
};