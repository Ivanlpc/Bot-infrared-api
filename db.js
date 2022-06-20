const mysql2 = require('mysql2');

const config = require('./config.json');

pool = mysql2.createPool(config.DB);

pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error(config.error.PROTOCOL_CONNECTION_LOST);
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error(config.error.ER_CON_COUNT_ERROR);
        }
        if (err.code === "ECONNREFUSED") {
            console.error(config.error.ECONNREFUSED);
        }
    } else {
        if (conn) conn.release()
        console.log('Connection with database has been established')
        return;
    }
})

module.exports = pool
