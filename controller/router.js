const Router = require('koa-router')
const bodyParser = require('koa-bodyparser');
const myrequest = require('./modules/base');
let myRequest = new myrequest();

module.exports = function (app) {
    const router = new Router();
    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods());

    router.get('/', async (ctx, next) => {
        let resData = {};
        let data = {};

        data = await myRequest.post('/be/newinfo.api', {p: 310101});
        if (data.success) {
            resData.data = data;
            console.log("data==", data);
        }

        resData.base = {
            title: '案例页',
            self: 'cases',
        };

        ctx.body = await ctx.render('index.html', resData);
    });

    let asyncPage = async (ctx, next) => {
        let _htmlUrl = ctx.request.url.replace("/views/", "");
        ctx.body = await ctx.render(_htmlUrl, {title: "111"});
    };

    const viewsFile = "/views";

    router.get(viewsFile + '/:page0', asyncPage);
    router.get(viewsFile + '/:page0/:page1', asyncPage);
    router.get(viewsFile + '/:page0/:page1/:page2', asyncPage);
    router.get(viewsFile + '/:page0/:page1/:page2/:page3', asyncPage);
    router.get(viewsFile + '/:page0/:page1/:page2/:page3/:page4', asyncPage);
};