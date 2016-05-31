const mysql = require('mysql');

const pool = mysql.createPool({
 host     : 'localhost',
 user     : 'root',
 password : '',
 database : 'chatdemo_db'
});
// const pool = mysql.createPool({
//     host     : '50.62.209.75',
//     user     : 'ChatTest',
//     password : 'Chat@Test1432#',
//     database : 'ChatDB_Test'
// });

module.exports = pool;
