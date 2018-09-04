'use strict';

const koaRouter = require('koa-router');
const router = new koaRouter();
const config = require('./Config');
const asyncRender = require('./AsyncRender');
const getJsonData = require('./GetJsonData');

const suffixName = config.suffix_name;
const viewsFile = config.views_file;

const viewsRouter = getJsonData("dist/views/views-manifest.json");
const sappRouter = getJsonData("views/sapp/sapp-manifest.json");

//HTTP GET请求
router.get(['/', '/login' + suffixName, '/views'], async (ctx, next) => {
    ctx.redirect("/views/login" + suffixName);
});

router.get(['/index' + suffixName], async (ctx, next) => {
    ctx.redirect("/views/index" + suffixName);
});

router.get('/views/update_static_res' + suffixName, asyncRender.updateStaticReader);

//SAPP Router
if (sappRouter) {
    for (let i in sappRouter) {
        let url_path = i;

        if (!url_path.endsWith(suffixName)) {
            url_path = url_path.replace(".html", suffixName)
        }

        console.log("独立项目跳转 Router：", viewsFile + '/sapp/' + url_path)
        router.get(viewsFile + '/sapp/' + url_path, asyncRender.sappReader);
    }
}

//Router All
if (viewsRouter) {
    config.router_json = viewsRouter;

    for (let i in viewsRouter) {
        let url_path = i;

        if (!url_path.endsWith(suffixName)) {
            url_path = url_path.replace(".html", suffixName)
        }
        
        console.log("内部 Router：", viewsFile + '/' + url_path)
        router.get(viewsFile + '/' + url_path.replace(".vpage", ""), asyncRender.viewsReader);
        router.get(viewsFile + '/' + url_path, asyncRender.viewsReader);
    }
}

module.exports = router;