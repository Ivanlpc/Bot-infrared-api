const axios = require('axios');
const config = require('../config.json');

class MCSrvStatus{
    constructor(){
        this.url = config.MCSRVSTATUS_URL;
    }
    getServerInformation(ip) {
        return new Promise((resolve, reject) => {
            axios.get(this.url + ip).then((response) => {
                
                if(response.data.online){
                    resolve({
                        online: true,
                        hostname: response.data.hostname,
                        port: response.data.port,
                        ip: response.data.ip,
                        protected: config.PROXY_IPS.includes(response.data.ip) ? true : false,
                        version: response.data.version,
                        players: {
                            online: response.data.players.online,
                            max: response.data.players.max
                        }
                    })
                }else{
                    resolve({
                        online: false,
                        ip: response.data.ip,
                        port: response.data.port,
                        hostname: response.data.hostname,
                    })

                }
            }).catch(err => {
                console.log(err)
                reject(err)
    
            })
        })   
    }
}
module.exports = MCSrvStatus