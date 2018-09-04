const request = require('request');
//这里是你的后端的接口默认地址。
const requestDomain = require('./RequestDomain');

const requestNode = {
    get(url, data, callback) {
        data = data || {};
        let baseHttp = requestDomain[process.env.NODE_ENV == "dev" ? 'test' : process.env.NODE_ENV];
        return new Promise(function (resolve, reject) {
            let myUrl = `${baseHttp}${url}?`;
            let dataArray = [];
            for (let k in data) {
                let paramStr = `${k}=${data[k]}`;
                dataArray.push(paramStr);
            }
            let urlStr = dataArray.join("=");
            myUrl = `${myUrl}${urlStr}`;
            request(myUrl, (error, response, data) => {
                if (response) {
                    if (!error && response.statusCode == 200) {
                        // console.log(`GET >> ${myUrl} >> data ===`, JSON.stringify(data));
                        resolve(data);
                    } else {
                        reject({ error: response.body });
                        // console.log(response.body)
                    }
                } else {
                    //后台程序错误
                    var data = {
                        ResultCode: 0,
                        Message: '与后台通信异常'
                    }
                    resolve(data);
                }
            });
        });
    },

    post(url, data) {
        data = data || {};
        return new Promise(function (resolve, reject) {
            let baseHttp = requestDomain[process.env.NODE_ENV == "dev" ? 'test' : process.env.NODE_ENV];
            // console.log(`${baseHttp}${url}`)
            request.post({
                url: `${baseHttp}${url}`,
                json: true,
                form: (data)
            }, function (error, response, data) {
                if (response) {
                    if (!error && response.statusCode == 200) {
                        // console.log(`POST >> ${baseHttp}${url} >> data ===`, JSON.stringify(data));
                        resolve(data);
                    } else {
                        reject({ error: response.body });
                        // console.log(response.body)
                    }
                } else {
                    console.log(error);
                    //后台程序错误
                    var data = {
                        ResultCode: 0,
                        Message: '与后台通信异常'
                    }
                    resolve(data);
                }
            });
        });
    }
}

module.exports = requestNode;