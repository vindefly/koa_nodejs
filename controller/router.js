const router = require("koa-router")();
const bodyParser = require('koa-bodyparser');
const promised = require("fs.promised");
const viewsFile = "/views";

const getUrl = function (app) {
    app.use(bodyParser());
    app.use(router.routes());

    const readFile = (path, ascCode) => {
        return new Promise((resolve, reject) => {
            promised.readFile(path, ascCode, (err, data) => {
                if (err) {
                    resolve(`<div style="color: #f00; font-size: 100px; text-align: center; color: #aaa; line-height: 300px;">错误页面</div>`);
                } else {
                    resolve(data)
                }
            })
        })
    };

    const asyncPage = async (ctx, next) => {
        ctx.response.type = 'html';//指定content type
        let templateUrl = "";
        for (let i in ctx.params) {
            templateUrl += "/" + ctx.params[i]
        }
        console.info('views' + templateUrl);
        ctx.response.body = await readFile('.' + viewsFile + templateUrl, 'utf-8');
    };

    router.get('/', async (cxt, next) => {
        cxt.response.redirect(viewsFile + "/index.html");
    });
    //
    router.get(viewsFile + '/:page0', asyncPage);
    router.get(viewsFile + '/:page0/:page1', asyncPage);
    router.get(viewsFile + '/:page0/:page1/:page2', asyncPage);
    router.get(viewsFile + '/:page0/:page1/:page2/:page3', asyncPage);
    router.get(viewsFile + '/:page0/:page1/:page2/:page3/:page4', asyncPage);
};

module.exports = {
    getUrl: getUrl
};