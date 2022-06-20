const axios = require('axios');
const config = require('../config.json');

class API {

    constructor() {
        this.api_url = config.API_URL
    }

    getProxyList() {
        return new Promise((resolve, reject) => {
            axios.get(this.api_url + '/proxies').then((response) => {
                resolve({
                    status: true,
                    data: response.data //array
                })
            }).catch((err) => {
                reject(err)
            })
        })

    }

    getProxyInfo(proxy) {
        return new Promise((resolve, reject) => {
            axios.get(this.api_url + '/proxies/' + proxy).then((response) => {
                resolve({
                    status: true,
                    data: {
                        domainNames: response.data.domainNames //array
                    }
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }

}

module.exports = API