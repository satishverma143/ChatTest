var express = require('express');
var pool = require('../config/connection.js');


module.exports.GetAllUsers = function (callback) {
    pool.query('SELECT * from users ORDER BY id DESC',
	function (err, result) {
        if (err)
            console.log(err);
        else
            callback(result);
    });
};

module.exports.InsertUser = function (req, userData, callback) {
    pool.query("SELECT * FROM users WHERE email = ?", userData.email, function (err, rows) {
        if (err)
            console.log(err);
        if (rows.length) {
            console.log('Sorry! That email is already taken.');
            callback(null);
        }
        else {
            pool.query('INSERT INTO users SET ?', [userData], function (err, result) {
                if (err)
                    console.log(err);
                else {
                    callback(result);
                }
            });
        }
    });
};

module.exports.GetUser = function (user_id, callback) {
    pool.query('SELECT * FROM users WHERE id=' + user_id, function (err, result) {
        if (err)
            console.log(err);
        else
            callback(result);
    });
};

module.exports.UpdateUser = function (userData, callback) {
    pool.query('UPDATE users SET username = ?, roleid = ?, updated_at = ?, is_active = ?, usericon_color = ? WHERE id = ?',
      [userData.name, userData.ddlrole, new Date(), userData.optstatus, userData.usericon_color, userData.user_id] ,
        function (err) {
        if (err)
            console.log(err);
        else
            callback(userData.user_id);
    });
};