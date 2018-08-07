const request = require('request');

let baseHttp = "https://www.test.17zuoye.net/";  //这里是你的后端的接口默认地址。

class myRequest {
    constructor() {

    }

    get(url, data, callback) {
        let myUrl = `${url}?`;
        let dataArray = [];
        for (let k in data) {
            let paramStr = `${k}=${data[k]}`;
            dataArray.push(paramStr);
        }
        let urlStr = dataArray.join("=");
        myUrl = `${myUrl}${urlStr}`;
        request(myUrl, (error, response, body) => {
            if (response && response.statusCode && response.statusCode === 200) {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    body = null;
                }
                callback && callback(body);
            }
        });
    }

    post(url, data) {
        return new Promise(function (resolve, reject) {
            request.post({
                url: `${baseHttp}${url}`,
                json: true,
                form: (data)
            }, function (error, response, data) {
                if (response) {
                    if (!error && response.statusCode == 200) {
                        resolve(data);
                        // callback && callback(data.Data);
                    } else {
                        reject('error===');
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

module.exports = myRequest;