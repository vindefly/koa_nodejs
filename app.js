// pm2 start app.js -i max 启动多个线程负载均衡
// test ： pm2 start app.js -i 4 四个线程就可以了

// development || production
// 环境变量设置 export NODE_ENV=development
const { env } = process;
const http = require('http');
const https = require('https')
const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const render = require('koa-swig');
const koaStatic = require("koa-static");
const bodyParser = require('koa-bodyparser');
const fs = require('fs');

const co = require('co');
const path = require('path');
const router = require("./controller/AutoRouter");

const getJsonData = require('./controller/GetJsonData');
const config_env = getJsonData("./config/env.json");

const mime = require('mime');
const requestNode = require('./controller/modules/RequestNode');

if (config_env) {
    env.NODE_ENV = config_env.NODE_ENV;
    env.PORT = config_env.PORT;
} else {
    env.NODE_ENV = "dev";
}

const port = ((process && process.env && process.env.PORT) || 3000);

console.log('NODE_ENV =>>>', env.NODE_ENV)

app.use(logger());

app.context.render = co.wrap(render(app, {
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: 'memory', // disable, set to false
    encoding: 'utf8',
    watch: false,
    ext: 'html'
}));

app.use(koaStatic(path.join(__dirname, "dist/static"), {
    maxage: env.NODE_ENV === "dev" ? 0 : 1000 * 60 * 60 * 24,   //1000 * 60 * 60 * 24 cookie有效时长
    extensions: ['html', 'js']
}));

app.use(router.routes());
app.use(router.allowedMethods());
app.use(bodyParser({
    formidable: {
        uploadDir: __dirname
    },
    jsonLimit: '10mb',
    formLimit: '10mb'
}));

/**
 * 运行时错误处理，这里很重要
 * @param  {[type]}	[description]
 * @return {[type]} [description]
 */
app.use(async (ctx, next) => {
    try {
        // 测试环境
        if (env.NODE_ENV === "dev" && !(ctx.request.header['upgrade-insecure-requests'] === '1') && (ctx.request.method === "GET" || ctx.request.method === "POST")) {
            let rpath = ctx.request.path;
            let data = null;

            ctx.response.type = mime.getExtension('application/json');
            if (ctx.request.method === "GET") {
                data = await requestNode.get(rpath, ctx.request.query || {});
            } else if (ctx.request.method === "POST") {
                data = await requestNode.post(rpath, ctx.request.body);
            }

            if (data) {
                ctx.response.body = data;
            } else {
                await next();
            }
        } else {
            await next();
        }
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.type = 'html';
        ctx.response.body = `<h2>Page ${ctx.response.status}</h2> ${err} <p>Something wrong, please contact administrator. </p>`;
        ctx.app.emit('error', err + "=== GET : " + ctx.request.url, ctx);
    }
});

app.use((ctx => {
    ctx.throw(500);
}));

app.on("error", (err) => {
    //捕获异常记录错误日志
    console.log('%s - %s', new Date, err);
});

app.use(router.routes())

// 创建服务器监听 http
http.createServer(app.callback()).listen(port, () => {
    console.log('服务已启动，port:', port,  ">>>>> http://localhost:" + port);
});

// 创建服务器监听 https
// https.createServer({
//     key: fs.readFileSync('./config/ssl/privatekey.pem'),
//     cert: fs.readFileSync('./config/ssl/certificate.pem')
// }, app.callback()).listen(443, () => {
//     console.log('服务已启动，port:443');
// });