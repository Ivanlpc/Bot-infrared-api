const pool = require ('../db.js');

class Bot {
    getUser(id) {
        
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE discord_ID = ?";
            pool.query(sql, [id], (err, rows) => {
                if(err) {
                    console.log(err);
                    reject({
                        status: false,
                        message: err
                    })
                }else{

                    if(rows.length <= 0) {
                        
                        resolve({
                            status: true,
                            exists: false
                        })
                    }else{
                        
                        resolve({
                            status: true,
                            exists: true
                        })
                    }

                }
            })
        })
    }

    addUser(id, tag, rank = 0){
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO users (discord_ID, user_tag, rank) VALUES (?, ?, ?)";
            pool.query(sql, [id, tag, rank], (err, rows) => {
                if (err){
                    console.log(err)
                    reject(err)
                }else{
                    if(rows.affectedRows <=0){
                        resolve({
                            status: false,
                            inserted: false
                        })
                    }else{
                        resolve({
                            status: true,
                            inserted: true
                        })
                    }
                }
            })
        })
    }

    removeUser(id){
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM users WHERE discord_ID = ?";
            pool.query(sql, [id], (err, rows) => {
                if (err){
                    console.log(err)
                    reject(err)
                }else{
                    if(rows.affectedRows <=0){
                        resolve({
                            status: true,
                            deleted: false
                        })
                    }else{
                        resolve({
                            status: true,
                            deleted: true
                        })
                    }
                }
            })
        })
    }
}

module.exports = Bot