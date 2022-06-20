const pool = require("../db.js");

class ExtraFunctions {

    checkPerms(id) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE discord_ID = ?";
            pool.query(sql, [id], (err, rows) => {
                if(err) {
                    console.log(err)
                    return reject(err)
                }else{
                    if(rows.length <= 0){
                        resolve({
                            status: true,
                            hasPermission: false,
                            rank: 0
                        })
                    }else{
                        resolve({
                            status: true,
                            hasPermission: true,
                            rank: rows[0].rank
                        })
                    }
                    
                }
            })
        })
    }

}

module.exports = ExtraFunctions